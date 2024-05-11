
export type Recipe = {
  _id: string,
  title: string,
  category: string,
  type: Array<RecipeType>,
  times: Array<RecipeTime>,
  numberOfPeople: string,
  ingredients: Array<RecipeIngredient>,
  steps: Array<RecipeStep>,
  img: string
}

export type RecipeType = {
  _id: string,
  title: string,
  links: Array<RecipeTypeLink>
}

export type RecipeTypeLink = {
  _id: string,
  text: string
}

export type RecipeTime = {
  _id: string,
  label: string,
  time: string
}

export type RecipeIngredient = {
  _id: string,
  quantity: number,
  unit: string,
  description: string
}

export type RecipeStep = {
  _id: string,
  step: number,
  text: string
}