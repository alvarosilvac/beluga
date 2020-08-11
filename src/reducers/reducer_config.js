import store_config from "../assets/store_config";

export default function configReducer(state = { ...store_config }, action){
  switch(action.type){
    case "SET_CONFIG":
      return { ...action.config };
    case "SET_PRODUCTS":
      return { ...state, products: action.products };
    case "SET_COLLECTIONS":
      return { ...state, collections: action.collections };
    default:
      return state;
  }
}