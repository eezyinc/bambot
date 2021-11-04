import { getEnv } from "../src/envWrapper"

beforeEach(() => {
  process.env["aValue"] = "yuppp"
})

test("getJson_happy", () => {
  expect(getEnv("aValue")).toBe("yuppp")
})

test("getJson_sad", () => {
  expect(getEnv("aValue_that_isnt_there")).toBe("")
})
