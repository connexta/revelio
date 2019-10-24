const toNearFilter = (value: string) => ({ value, distance: 2 })

const fromNearFilter = (value: any) => value.value

const toBetweenFilter = (value: string) => ({ lower: value, upper: value })

const fromBetweenFilter = (value: any) => value.lower

export const FROM: any = {
  NEAR: fromNearFilter,
  BETWEEN: fromBetweenFilter,
}

export const TO: any = {
  NEAR: toNearFilter,
  BETWEEN: toBetweenFilter,
}
