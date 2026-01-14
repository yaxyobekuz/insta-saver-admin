// Slices
import modalSlice from "./modal.store";
import arrayStore from "./array.store";
import objectStore from "./object.store";

// Redux Store
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    modal: modalSlice,
    arrayStore: arrayStore,
    objectStore: objectStore,
  },
});
