import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Divider,
  Container,
  Grid,
} from '@mui/material';

import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import {
  AddIntrests,
  GetMyIntrests,
  selectmySubscription,
  selectManageUserSubscription,
} from '../PropertySlice1';
import AreaJson from '../../../../assets/Default/area/result.json';
import SubmitInterestForm from '../property-components/SubmitIntrests';

const MySubscriptions = (props) => {
  let { userid, isAdmin, subscriptions } = props;

  // console.log("this is show contaient in my subscripction:",showContent)
  const location = useLocation();
  // const uid = location.pathname.split('/').pop();
  let uid;
  const [stateData, setStateData] = useState([]);
  const Subscription = useSelector(isAdmin ? selectManageUserSubscription : selectmySubscription);
  const [editingStateIndex, setEditingStateIndex] = useState(null);
  const [editingDistrictName, setEditingDistrictName] = useState(null);
  const [editingDistrictData, setEditingDistrictData] = useState(null);
  const [removedItems, setRemovedItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [previousAreas, setPreviousAreas] = useState([]);
  const [seeMore, setSeeMore] = useState({});
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const user = useSelector(selectUser);
  console.log('user', user);
  // let isadmin;
  if (userid) {
    uid = userid;
  }

  const req_user_id = user?.uid;

  userid = userid || req_user_id;
  isAdmin = isAdmin || false;

  const processInterests = (interestedAreas) => {
    if (!interestedAreas) return;

    const districtAreasMap = {};
    interestedAreas.forEach((item) => {
      if (!districtAreasMap[item.district]) {
        districtAreasMap[item.district] = [];
      }
      districtAreasMap[item.district].push(item.area);
    });

    const stateDistrictMap = {};
    Object.entries(AreaJson.district_status).forEach(([stateName, districts]) => {
      const stateDistricts = [];
      Object.keys(districts).forEach((districtName) => {
        if (districtAreasMap[districtName]) {
          const areas = districtAreasMap[districtName];
          if (areas.includes('All Areas')) {
            const allAreas = AreaJson.areas[districtName].map((area) => area.area);
            stateDistricts.push({
              name: districtName,
              areas: allAreas,
            });
          } else {
            stateDistricts.push({
              name: districtName,
              areas,
            });
          }
        }
      });
      if (stateDistricts.length > 0) {
        stateDistrictMap[stateName] = stateDistricts;
      }
    });

    setStateData(
      Object.entries(stateDistrictMap).map(([stateName, districts]) => ({
        stateName,
        districts,
      }))
    );
  };

  useEffect(() => {
    // if (user) {
    dispatch(GetMyIntrests({ uid, isAdmin })).then((response) => {
      if (response) {
        console.log('interested aread ', response);
        const { response1, isDifferentUser } = response.payload;
        console.log('interested aread 1', response.payload.interested_areas);
        if (response1?.interested_areas) {
          processInterests(response1.interested_areas);
        }
      }
    });
    // }
  }, [dispatch, uid, isAdmin]);

  useEffect(() => {
    if (Subscription) {
      processInterests(Subscription);
    }
  }, [Subscription]);

  const handleEditClick = (stateIndex, districtName) => {
    setEditingStateIndex(stateIndex);
    setEditingDistrictName(districtName);
    const districtData = stateData[stateIndex].districts.find(
      (district) => district.name === districtName
    );

    if (!districtData) return;

    setEditingStateIndex(stateIndex);
    setEditingDistrictName(districtName);
    setEditingDistrictData({ ...districtData });
    setRemovedItems([]);
    setAddedItems([]);
    setPreviousAreas([...districtData.areas]);
  };

  const handleAddItem = (item) => {
    const currentAreasCount = editingDistrictData.areas.length;
    if (user.data.active_notifications <= 0 && currentAreasCount >= 10) {
      setMessage('You are restricted from adding more than 10 areas.');
      setTimeout(() => {
        setMessage('');
      }, 3000);

      console.log('You are restricted from adding more than 10 areas.');
      return;
    }
    if (user.data.active_notifications <= 0 && item === 'All Areas') {
      setMessage('You are restricted from adding more than 10 areas.');
      setTimeout(() => {
        setMessage('');
      }, 3000);

      console.log('You are restricted from adding more than 10 areas.');
      return;
    }
    if (item === 'All Areas') {
      setEditingDistrictData({
        ...editingDistrictData,
        areas: ['All Areas'],
      });
      setRemovedItems(editingDistrictData.areas.filter((i) => i !== 'All Areas'));
      setAddedItems(['All Areas']);
    } else {
      const updatedItems = [...editingDistrictData.areas, item];
      setEditingDistrictData({
        ...editingDistrictData,
        areas: updatedItems,
      });
      setRemovedItems(removedItems.filter((i) => i !== item));
      setAddedItems([...addedItems, item]);
    }
  };

  const handleRemoveItem = (item) => {
    if (item === 'All Areas') {
      setEditingDistrictData({
        ...editingDistrictData,
        areas: [],
      });
      setRemovedItems(['All Areas']);
      setAddedItems([]);
    } else {
      const updatedItems = editingDistrictData.areas.filter((i) => i !== item);
      setEditingDistrictData({
        ...editingDistrictData,
        areas: updatedItems,
      });
      setRemovedItems([...removedItems, item]);
      setAddedItems(addedItems.filter((i) => i !== item));
    }
  };

  const handleItemClick = (item) => {
    // if (!editingDistrictData) return;

    if (item === 'All Areas') {
      if (editingDistrictData.areas.includes(item)) {
        handleRemoveItem(item);
      } else {
        handleAddItem(item);
      }
    } else {
      if (editingDistrictData.areas.includes(item)) {
        handleRemoveItem(item);
      } else {
        handleAddItem(item);
      }
    }
  };

  const mapAreasToIds = (areas, districtName) => {
    const areaMap = AreaJson.areas[districtName];
    return areas
      .map((areaName) => {
        const area = areaMap.find((area) => area.area === areaName);
        return area ? area.id : null;
      })
      .filter((id) => id !== null);
  };

  const handleSaveChanges = () => {
    if (!editingDistrictData) return;

    const updatedStateData = [...stateData];
    const districtIndex = updatedStateData[editingStateIndex].districts.findIndex(
      (district) => district.name === editingDistrictName
    );
    updatedStateData[editingStateIndex].districts[districtIndex] = editingDistrictData;
    setStateData(updatedStateData);
    setEditingStateIndex(null);
    setEditingDistrictName(null);
    setEditingDistrictData(null);
    setRemovedItems([]);
    setAddedItems([]);
    setPreviousAreas([]);

    const removedAreaIds = mapAreasToIds(removedItems, editingDistrictName);
    const addedAreaIds = mapAreasToIds(addedItems, editingDistrictName);
    console.log('My Subscripction submit intrest req_uesr_id:', req_user_id);
    // const user_id = user_id;
    if (removedAreaIds.length > 0 || addedAreaIds.length > 0) {
      const dataToSend = {
        body: [
          // userid,
          // req_user_id,
          // isadmin:true,
          {
            areas: removedAreaIds,
            status: 'delete',
          },
          {
            areas: addedAreaIds,
            status: 'add',
            district: editingDistrictName,
          },
        ],
      };
      const inputParams = { user_id: userid, req_user_id, isadmin: isAdmin, dataToSend };
      console.log('MySubscriptions Form Input params to AddInterests:', inputParams);
      dispatch(AddIntrests(inputParams));
    }
  };

  const handleCancelEdit = () => {
    setEditingStateIndex(null);
    setEditingDistrictName(null);
    setEditingDistrictData(null);
    setRemovedItems([]);
    setAddedItems([]);
    setPreviousAreas([]);
  };

  const getAllAreasForDistrict = (districtName) => {
    return AreaJson.areas[districtName]?.map((area) => area.area) || [];
  };

  const sortItemsAlphabetically = (items) => {
    return [...items].sort((a, b) => a.localeCompare(b));
  };

  const handleToggleSeeMore = (districtIndex) => {
    setSeeMore((prev) => ({
      ...prev,
      [districtIndex]: !prev[districtIndex],
    }));
  };

  console.log('state obj ', stateData);
  const inputParams = { user_id: userid, isadmin: isAdmin, req_user_id };
  console.log('submitInterest form inputparams ', inputParams);
  return (
    <Container>
      <h1 style={{ margin: '10px' }}>My Subscriptions</h1>
      <hr />
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>

      </div> */}
      <Grid container spacing={1}>
        <Grid item md={4} sm={12} sx={{ marginTop: '30px' }}>
          <SubmitInterestForm params={inputParams} />
        </Grid>
        <Grid item md={8} sm={12}>
          {stateData.map((stateObj, stateIndex) => (
            <div key={stateIndex} style={{ margin: '20px', width: '100%' }}>
              <hr />
              {message && (
                <div
                  className="message"
                  style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    padding: '10px',
                    marginTop: '10px',
                    borderRadius: '5px',
                    textAlign: 'center',
                  }}
                >
                  {message}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {stateObj.districts.map((districtObj, districtIndex) => {
                  const isEditing =
                    editingStateIndex === stateIndex && editingDistrictName === districtObj.name;
                  const items = isEditing
                    ? getAllAreasForDistrict(districtObj.name)
                    : districtObj.areas;
                  const selectedItems = items.filter((item) =>
                    editingDistrictData?.areas.includes(item)
                  );
                  const unselectedItems = items.filter(
                    (item) => !editingDistrictData?.areas.includes(item)
                  );
                  const sortedSelectedItems = sortItemsAlphabetically(selectedItems);
                  const sortedUnselectedItems = sortItemsAlphabetically(unselectedItems);
                  const allItems = [...sortedSelectedItems, ...sortedUnselectedItems];
                  const itemsToShow =
                    seeMore[districtIndex] || isEditing ? allItems : allItems.slice(0, 5);

                  return (
                    <Card
                      key={districtIndex}
                      style={{
                        margin: '10px',
                        minWidth: '300px',
                        position: 'relative',
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="div"
                          // style={{ marginBottom: "10px" }}
                        >
                          {stateObj.stateName}
                        </Typography>
                        <div style={{ display: 'flex' }}>
                          <Typography sx={{ fontSize: '20px', fontWeight: '600' }} component="div">
                            {districtObj.name}
                          </Typography>
                          {isEditing ? (
                            <IconButton
                              sx={{ position: 'absolute', top: 0, right: 0 }}
                              aria-label="cancel"
                              onClick={handleCancelEdit}
                            >
                              <CloseIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              sx={{ position: 'absolute', top: 40, right: 0 }}
                              aria-label="edit"
                              onClick={() => handleEditClick(stateIndex, districtObj.name)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </div>
                        <hr />
                        <List>
                          {itemsToShow.map((item, idx) => (
                            <ListItem key={idx} sx={{ padding: '0px' }}>
                              <ListItemText primary={item} />
                              {isEditing && (
                                <Checkbox
                                  edge="end"
                                  checked={editingDistrictData.areas.includes(item)}
                                  onChange={() => handleItemClick(item)}
                                  disabled={
                                    editingDistrictData.areas.includes('All Areas') &&
                                    item !== 'All Areas'
                                  }
                                />
                              )}
                            </ListItem>
                          ))}
                        </List>
                        {!isEditing && allItems.length > 5 && (
                          <Button onClick={() => handleToggleSeeMore(districtIndex)}>
                            {seeMore[districtIndex] ? 'See Less' : 'See More'}
                          </Button>
                        )}
                        {isEditing && (
                          <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                              sx={{
                                borderRadius: '7px',
                                width: '70px',
                                left: '0px',
                              }}
                              variant="contained"
                              // color="primary"
                              onClick={handleSaveChanges}
                              fullWidth
                            >
                              Save
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MySubscriptions;
