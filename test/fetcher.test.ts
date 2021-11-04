import dayjs from "dayjs"
import * as http from "../src/http"
import { getEnv } from "../src/envWrapper"
jest.mock("axios")
jest.mock("../src/envWrapper")
jest.mock("../src/http")
const getEnvMock = getEnv as jest.Mock
const getJson = http.getJson as jest.Mock
const getXml = http.getXml as jest.Mock
getEnvMock.mockReturnValue("env-var")
import { employees, holidaysAndTimeOff } from "../src/fetcher"

const YMD_FORMAT = "YYYY-MM-DD"
const BASE_URL = `https://env-var:x@api.bamboohr.com/api/gateway.php/env-var/v1`

test("getEnv", () => {
  expect(getEnvMock).toHaveBeenCalledWith("BAMBOOHR_KEY")
  expect(getEnvMock).toHaveBeenCalledWith("BAMBOOHR_SUBDOMAIN")
})

test("employees", async () => {
  const dirRes = [
    {
      displayName: "my-name",
      id: "my-id",
      photoUrl: "my-photo.com",
    },
  ]
  const byIdRes = {
    birthday: dayjs("01-01"),
    hireDate: dayjs("2018-01-01"),
  } as any
  getJson
    .mockResolvedValueOnce({ employees: dirRes })
    .mockResolvedValueOnce(byIdRes)

  expect(await employees()).toEqual([
    {
      id: "my-id",
      name: "my-name",
      photoUrl: "my-photo.com",
      ...byIdRes,
    },
  ])

  expect(getJson).toHaveBeenCalledWith(`${BASE_URL}/employees/directory`)
  expect(getJson).toHaveBeenCalledWith(
    `${BASE_URL}/employees/${dirRes[0].id}?fields=birthday,hireDate`
  )
})

test("holidaysAndTimeOff", async () => {
  const today = dayjs().startOf("day")
  const t = today
  const exp = {
    holidays: [{ name: "Thanksgiving Day", date: t }],
    timeOff: { "my-id": [{ id: "my-id", startDate: t, endDate: t }] },
  }
  const to = exp.timeOff["my-id"][0]
  const outRes = [
    {
      $: { type: "timeOff" },
      employee: [{ $: { id: to.id } }],
      end: [to.endDate],
      start: [to.startDate],
    },
    {
      $: { type: "holiday" },
      holiday: [{ _: exp.holidays[0].name }],
      start: [exp.holidays[0].date],
    },
  ]
  getXml.mockResolvedValue({ calendar: { item: outRes } })

  expect(await holidaysAndTimeOff(today)).toEqual(exp)

  expect(getXml).toHaveBeenCalledWith(
    `${BASE_URL}/time_off/whos_out/?end=${t.add(1, "month").format(YMD_FORMAT)}`
  )
})
