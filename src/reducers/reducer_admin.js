export default function adminReducer(state = false, action){
  switch(action.type){
    case "SET_ADMIN":
      return action.isAdmin;
    default:
      return state;
  }
}