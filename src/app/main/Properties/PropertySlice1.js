import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import qs from 'qs';
import Statesdata from "../../../assets/Default/area/result.json";
import { showMessage } from "app/store/rabit/messageSlice";
import BaseUrl from "app/configs/BaseUrl";
import { useDispatch } from "react-redux";

const getUserIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user
};
// plot flat thunk function
export const CardsClick = createAsyncThunk(
  "property/CardsClick",
  // async ({ formData, offset }, { rejectWithValue, fulfillWithValue }) => {
  async ({ formData, offset }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const req_by = user.uid;

      const Data = {
        req_by: req_by,
        offset: offset,
        body: formData,
      };
      console.log("Data", Data);
      const response = await axios.post(`${BaseUrl}/search`, Data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("Data", Data);
      // const response = await axios.post(`${BaseUrl}/search`, Data, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      if (response.status !== 200) {
        throw new Error("Failed to fetch search results");
      }
      if (response?.data.property.length === 0) {
        showMessage("No Results Found");
      }
      // if (response?.data.property.length === 0) {
      //   showMessage("No Results Found");
      // }

      const payload = {
        properties: response.data.property,
        // totalProperties: response.data.total_properties,
        // PropertyState: PropertyState,
        // isAdminSearch: isAdminSearch
      };

      // if (isAdminSearch === "local") {
      //   return payload;
      // }
      // if (isAdminSearch) {
      //   return fulfillWithValue(payload);
      // } else {
      //   return fulfillWithValue(payload);
      // }
      // return payload;
      return payload;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const selectPropertyById = (state, property_id) =>
  state.properties.properties.find(
    (property) => property.property_id === property_id
  );


//  my intrests thunk function
export const AddIntrests = createAsyncThunk(
  "property/AddIntrests",
  async (params, { rejectWithValue }) => {
    console.log("params:", params);

    const { user_id, req_user_id, isadmin, dataToSend } = params;
    console.log("this is the user id in addintrest:", user_id);
    console.log("this is the user id in req_user_id:", req_user_id);
    
    try {
      let userIdToUse = user_id;

      if (userIdToUse && isadmin) {
        userIdToUse = user_id;
        console.log("user_id being used:", userIdToUse);
      } else {
        userIdToUse = req_user_id;
      }

      const Data = {
        user_id: userIdToUse,
        req_user_id,
        body: dataToSend.body,
      };
     
      console.log("Data:", Data);
      console.log("Data to be sent:", JSON.stringify(Data));
      const response = await axios.put(`${BaseUrl}/register`, Data);
      console.log("Response:", response);
      const isDifferentUser = userIdToUse !== req_user_id;
      return { response: response.data, isDifferentUser};
      // return response;
    } catch (error) {
      console.error("Error in AddIntrests:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const AddAreaIntrests = createAsyncThunk(
  "property/AddAreaIntrests",
  async (dataToSend, { rejectWithValue }) => {
    console.log(dataToSend);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user.uid;
      const req_user_id = user.uid

      const Data = {
        user_id: user_id,
        body: dataToSend.body,
        req_user_id : req_user_id,
      };
      console.log("Data", Data);
      const response = await axios.put(`${BaseUrl}/register`, Data);
      console.log("responseo of add intresrs", response);
      return response;
    } catch (error) {
      console.log("error in Adding Intrests",error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetUpdatedJson = createAsyncThunk(
  "property/GetUpdatedJson",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseUrl}/getfile`, { responseType: "blob" });

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("response of download json",response)
      return response.data;
      
    } catch (error) {
      const errorMessage = JSON.stringify(
        error.response?.data || error.message,
        null,
        2
      );
      const blob = new Blob([errorMessage], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "error.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// export const GetUpdatedJson = createAsyncThunk(
export const GetMyIntrests = createAsyncThunk(
  "property/GetMyIntrests",
  async ({ uid, isAdmin }, { rejectWithValue }) => {
    console.log("{uid, isadmin}", uid, isAdmin);
    try {
      // const user = JSON.parse(localStorage.getItem("user"));
      // if (!user || !user.uid) throw new Error("User ID not found in local storage");
      // const myuserId = user.uid;
      let user_id;
      if (uid && isAdmin) {
        console.log("isAdmin",isAdmin)
        
        user_id = uid;
        console.log("userid is set from uid")
      } else {
        console.log("hii")
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("is the data:",user)
        user_id = user.uid;
        if (!user_id) throw new Error("User ID not found in local storage");
      }

      const response = await axios.get(
        `${BaseUrl}/register?user_id=${user_id}`
      );
      console.log("response of get my interest", response);
      // return response;
      const isDifferentUser = isAdmin;
      console.log("admin or not",isDifferentUser)
      return { response: response.data, isDifferentUser };
      // return (response);
    } catch (error) {
      console.error('Error in GetMyIntrests:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const DeleteIntrests = createAsyncThunk(
  "property/DeleteIntrests",
  async (formData, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user.uid;
      console.log(formData);
      const Data = {
        user_id: user_id,
        body: formData,
      };
      const response = await axios.post("", Data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const PostUserCallRequest = createAsyncThunk(
//   "property/PostUserCallRequest",
//   async (formData, { rejectWithValue }) => {
//     try {
//       // const user = JSON.parse(localStorage.getItem("user"));
//       // const user_id = user.uid;

//       // const Data = {
//       // user_id :  user_id ,
//       // userData,
//       // };
//       console.log("formData", formData);
//       const response = await axios.post(`${BaseUrl}/help`, formData);
//       console.log(response);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
export const PostUserCallRequest = createAsyncThunk(
  "property/PostUserCallRequest",
  async (formData, { rejectWithValue }) => {
    try {
      // const user = JSON.parse(localStorage.getItem("user"));
      // const user_id = user.uid;

      // const Data = {
      // user_id :  user_id ,
      // userData,
      // };
      console.log("formData in PostUserCallRequest", formData);
      const response = await axios.post(`${BaseUrl}/help`, formData);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const AddAreas = createAsyncThunk(
  "property/AddAreas",
  async (formData, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user.uid;

      const Data = {
        user_id: user_id,
        body: formData,
      };
      console.log(Data);
      const response = await axios.post(
        `${BaseUrl}/register?user_id=${user_id}`,
        Data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const ResetIndividualPropertState = createAsyncThunk(
  'property/ResetIndividualPropertState',
  async (_, { getState, dispatch }) => {
    try {
      // Access current state to reset properties.properties.data
      const currentState = getState();
      const { properties } = currentState;
      console.log(properties)

      // Logic to reset properties.properties.data
      // Replace properties.properties.data with your desired reset value
      const updatedProperties = {
        ...properties,
        properties: {
          ...properties.properties,
          data: {} // Replace with your reset value or initial state
        }
      };

      // Dispatch an action to update the state
      // Replace 'UPDATE_PROPERTIES' with your actual action type
      dispatch({ type: 'UPDATE_PROPERTIES', payload: updatedProperties });

      // Return any relevant data if needed
      return { success: true, message: 'Reset successful' };
    } catch (error) {
      // Handle errors if necessary
      console.error('Error resetting property state:', error);
      throw error; // Propagate the error to be handled elsewhere
    }
  }
);
export const fetchProperties = createAsyncThunk(
  "property/fetchProperty",
  async (propertyId, { rejectWithValue, getState }) => {
    console.log("property_id", propertyId);
    try {
      const state = getState();

      console.log(
        "state.properties.adminSearchResults",
        state.properties.adminSearchResults
      );

      const existingProperty = state.properties.adminSearchResults.find(
        (property) => property.property_id == propertyId
      );
      console.log("existingProperty", existingProperty);

      if (existingProperty) {
        const Data = {
          data: {
            images: existingProperty.prop_images,
            property: existingProperty,
          },

          // recent_properties: existingProperty.recent_properties,
          // recomended_prop: existingProperty.recomended_prop,
        };
        return Data;
      }

      const url = `${BaseUrl}/property_ind?prop_id=${propertyId}`;
      {
        console.log("server is getting called");
      }
      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error("Property data not received");
      }
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);


export const fetchRecentTransactions = createAsyncThunk(
  "property/fetchRecentTransactions",
  async (arg, { getState, rejectWithValue }) => {
    try {
      console.log("arg", arg);
      const state = getState();
      console.log("Current State:", state);

      // Initialize params object
      const params = {};

      // Conditionally set the status param
      // if (state.properties.Stats.length === 0) {
        params.status = 'True';
      // }

      // Create query string from params
      const queryString = qs.stringify(params, { encode: true });

      // Construct the request URL
      const requestUrl = `${BaseUrl}/home?${queryString}`;
      console.log("Request URL:", requestUrl);

      // Make the GET request with axios
      const response = await axios.get(requestUrl, {
        params: { offset: arg }
      });
      console.log("Response of recent transaction:", response);

      // Extract transactions and stats from response data
      const stats = response.data.property_type_count;
      const transactions = response.data.property.buy_properties.concat(
        response.data.property.sell_properties
      );

      // Return the transactions and stats as the payload
      return { transactions, stats };
    } catch (error) {
      console.error("Error fetching recent transactions:", error);

      // Handle errors and return the error message as rejected value
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// export const fetchRecentTransactions = createAsyncThunk(
//   "property/fetchRecentTransactions",
//   async (arg, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BaseUrl}/home`);
//       // const response = await axios.get(`${BaseUrl}/home`);
//       const transactions = response.data.property.buy_properties.concat(
//         response.data.property.sell_properties
//       );
//       return transactions;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const SearchResults = createAsyncThunk(
  "property/SearchResults",
  async (
    { formData, offset, isAdminSearch, PropertyState },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      console.log("hii")
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : {};
      const req_by = user.uid || '';
console.log("hii")
      const Data = {
        req_by: req_by,
        offset: offset,
        body: formData,
      };

      // const response = await axios.post(`${BaseUrl}/search`, Data, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      const response = await axios.post(`${BaseUrl}/search`, Data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("search response",response)

      if (response.status !== 200) {
        throw new Error("Failed to fetch search results");
      }
      if (response?.data.property.length === 0) {
        showMessage("No Results Found");
      }
      if (response?.data.property.length === 0) {
        showMessage("No Results Found");
      }

      const payload = {
        properties: response.data.property,
        totalProperties: response.data.total_properties,
        PropertyState: PropertyState,
        isAdminSearch: isAdminSearch,
        isAdminSearch: isAdminSearch,
      };

      if (isAdminSearch === "local") {
        return payload;
      }
      if (isAdminSearch) {
        return fulfillWithValue(payload);
      } else {
        return fulfillWithValue(payload);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const LocalResults = createAsyncThunk(
  "property/LocalResults",
  async (
    { formData, offset, isAdminSearch, PropertyState },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const req_by = user.uid;

      const Data = {
        req_by: req_by,
        offset: offset,
        body: formData,
      };

      const response = await axios.post(`${BaseUrl}/search`, Data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // const response = await axios.post(`${BaseUrl}/search`, Data, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      if (response.status !== 200) {
        throw new Error("Failed to fetch search results");
      }

      const payload = {
        properties: response.data.property,
        totalProperties: response.data.total_properties,
        PropertyState: PropertyState,
      };

      return fulfillWithValue(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const addProperty = createAsyncThunk(
//   "property/addProperty",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) throw new Error("User not found in local storage");

//       const cont_user_id = user.uid;
//       const data = { ...formData, cont_user_id };

//       const response = await axios.post(`${BaseUrl}/property`, data);
//       // const response = await axios.post(`${BaseUrl}/property`, data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
export const addProperty = createAsyncThunk(
  "property/addProperty",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    console.log(payload)
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not found in local storage");

      const cont_user_id = user.uid;
      const data = {...payload.payload  ,cont_user_id}
      console.log(data);
      const response = await axios.post(`${BaseUrl}/property`, data);
      console.log("addProperty response data", response);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateProperty = createAsyncThunk(
  "property/updateProperty",
  async ({ payload }, { rejectWithValue }) => {
    console.log("formData going during updateProperty",payload)
    try {
   
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not found in local storage");
   
      const req_user_id = user.uid;
      const data = { ...payload, req_user_id,  };
      console.log("update data", data);


      const response = await axios.put(`${BaseUrl}/property`, data);
      console.log("updateProperty response data", data);
      // const response = await axios.put(`${BaseUrl}/property`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateProperty = createAsyncThunk(
//   "property/updateProperty",
//   async ({ formData, p_id }, { rejectWithValue }) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) throw new Error("User not found in local storage");

//       const req_user_id = user.uid;
//       const data = { ...formData, req_user_id, p_id };
//       console.log("update data", data);
//       console.log("update data", data);

//       const response = await axios.put(`${BaseUrl}/property`, data);
//       // const response = await axios.put(`${BaseUrl}/property`, data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
export const DeleteImage = createAsyncThunk(
  "property/DeleteImage",
  async (formData) => {
    try {
      const response = await axios.delete(`${BaseUrl}/image`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: formData, // Directly pass formData here
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
);

export const AddImage = createAsyncThunk(
  "property/AddImage",
  async (formData) => {
    const response = await axios.post(`${BaseUrl}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // const response = await axios.post(`${BaseUrl}/image`, formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    console.log("response of upload image",response)

    if (response.status === 201) {
      window.alert("Upload successful");
    } else {
      throw new Error("Image Upload failed");
    }
    return response
  }
);

// Initial State
const initialState = {
  properties: [],
  localResults: [],
  recentTransactions: [],
  normalSearchResults: [],
  adminSearchResults: [],
  mySubscription: [],
  manageUserSubscription: [],
  paymentDetails: [],
  // UpdatepaymentDetails: [],
  admintotalProperties: "0",
  Stats: [],
  normaltotalResults: "0",
  status: "idle",
  error: null,
};

// Slice
const propertySlice = createSlice({
	name: "properties",
  //name: "property",
  initialState,
  reducers: {
    setProperties(state, action) {
      const propertyIndex = state.properties.findIndex(
        (property) => property.property_id === action.payload.property_id
      );
      if (propertyIndex !== -1) {
        state.properties[propertyIndex] = action.payload;
      } else {
        state.properties.push(action.payload);
      }
    },
    setError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    resetStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    resetProperty(state){
      state.properties = [];
    },
  },
  // extraReducers: (builder) => {
  extraReducers: (builder) => {
    builder
      .addCase(SearchResults.fulfilled, (state, action) => {
        // const { properties, totalProperties, PropertyState, isAdminSearch } =
        //   action.payload;
        const { properties, totalProperties, PropertyState, isAdminSearch } =
          action.payload;
        if (action.meta.arg.isAdminSearch) {
          if (PropertyState === "ExistingProperty") {
            state.adminSearchResults = [
              ...state.adminSearchResults,
              ...properties,
            ];
          } else {
            state.adminSearchResults = properties;
            state.admintotalProperties = totalProperties;
          }
        } else {
          if (PropertyState === "ExistingProperty") {
            state.normalSearchResults = [
              ...state.normalSearchResults,
              ...properties,
            ];
          } else {
            state.normalSearchResults = properties;
            state.normaltotalResults = totalProperties;
          }
        }
      })
      // .addCase(fetchProperties.fulfilled, (state, action) => {
      //   const propertyIndex = state.properties.findIndex(
      //     (property) => property.property_id === action.payload.property_id
      //   );
      //   if (propertyIndex !== -1) {
      //     state.properties[propertyIndex] = action.payload;
      //   } else {
      //     state.properties.push(action.payload);
      //   }
      // })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
      })
      // .addCase(postPaymentDetailsAdd.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.paymentDetails = action.payload;
      // })
      // .addCase(putPaymentDetailsUpdate.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.paymentDetails = action.payload;
      // })
      .addCase(ResetIndividualPropertState.fulfilled, (state, action) => {
        state.properties = action.payload;
      })
      .addCase(AddIntrests.fulfilled, (state, action) => {
        const { response, isDifferentUser } = action.payload;
        if (isDifferentUser) {
          state.manageUserSubscription = response.interested_areas;
        } else {
          state.mySubscription = response.interested_areas;
        }
      })
      .addCase(GetMyIntrests.fulfilled, (state, action) => {
        const { response, isDifferentUser } = action.payload;
        if (isDifferentUser) {
          state.manageUserSubscription = response.interested_areas;
        } else {
          state.mySubscription = response.interested_areas;
        }
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.recentTransactions = [
          ...state.recentTransactions,
          ...action.payload.transactions,
        ];
        if (action.payload.stats) {
          state.Stats = action.payload.stats; 
        }
      });
  },
});

// Actions and Selectors
export const { setProperties, setError, resetStatus,resetProperty } = propertySlice.actions;
export const selectProperties = (state) => state.properties.properties;
export const selectStats =(state) => state.properties.Stats;
export const selectRecentTransactions = (state) =>
  state.properties.recentTransactions;
export const selectNormalSearchResults = (state) =>
  state.properties.normalSearchResults;
export const selectAdminSearchResults = (state) =>
  state.properties.adminSearchResults;
export const selectadmintotalProperties = (state) =>
  state.properties.admintotalProperties;
export const selectnormaltotalResults = (state) =>
  state.properties.normaltotalResults;
export const selectPropertyStatus = (state) => state.properties.status;
export const selectPropertyError = (state) => state.properties.error;
export const selectmySubscription = (state) => state.properties.mySubscription;
export const selectManageUserSubscription = (state) => state.properties.manageUserSubscription;
export const selectManageUserpaymentDetails = (state) => state.properties.paymentDetails;

export default propertySlice.reducer;
