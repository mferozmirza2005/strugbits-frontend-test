import axios from "axios";

const getRecipes = async () => {
    const recipes = await axios.get("https://dummyjson.com/recipes");
    return recipes;
}

export default getRecipes;