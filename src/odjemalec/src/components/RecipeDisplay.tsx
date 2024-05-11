import {FC} from "react";
import {Recipe} from "../utils/recipeTypes";


type RecipeDisplayProps = {
  recipe: Recipe
}

const RecipeDisplay:FC<RecipeDisplayProps> = ({recipe}) => {

  return (
    <div>
      <h2>
        {recipe.title}
      </h2>
      <div>
        <h4>Koraki</h4>
        {recipe.steps.map((step) => {
          return (
            <div>
              {step.step}. {step.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecipeDisplay