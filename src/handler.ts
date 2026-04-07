import { Handler } from "aws-lambda"
import dayjs from "dayjs"
import "source-map-support/register"
import { employees, whosOut } from "./fetcher"
import { toEmployees } from "./mapper"
import { timeOffAndCelebrations } from "./publisher"

export const handle: Handler = async () => {
  try {
    const today = dayjs().startOf("day")
    const [es, wo] = await Promise.all([employees(), whosOut(today)])
    await timeOffAndCelebrations(toEmployees(es, wo, today), today)
    return { success: true }
  } catch (e) {
    console.error(e)
    throw e
  }
}
