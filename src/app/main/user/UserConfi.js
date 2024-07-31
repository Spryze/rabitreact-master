import i18next from 'i18next';

import en from 'src/app/configs/navigation-i18n/en.js';
import tr from 'src/app/configs/navigation-i18n/tr.js';
import ar from 'src/app/configs/navigation-i18n/ar.js';
import Profile from './Profile';
import Users from './Users';
// import UserProfile from './UserProfileDetails';
import ForgetPassword from '../Properties/Pages/ForgetPassword';
import ManageProperties from '../Properties/Pages/ManageProperties';
import ManageIntrests from '../Properties/Pages/ManageIntrests';
import { authRoles } from 'src/app/auth';
import ManageUserProfile from './ManageUserProfile';

i18next.addResourceBundle('en', 'propertyPage', en);
i18next.addResourceBundle('tr', 'propertyPage', tr);
i18next.addResourceBundle('ar', 'propertyPage', ar);

const userConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/user/profile',
      element: <Profile />,
    },
    
  ],
  auth: authRoles.admin,
  routes: [
  
    {
      path: '/manage/users',
      element: <Users />,
    },
    {
      path: '/manage/properties',
      element: <ManageProperties />,
    },
    {
      path: '/manage/intrests',
      element: <ManageIntrests />,
    },
    {      path: '/user/profile',
      element: <Profile />,
    },
    {
    	//jagadeesh code
      path: '/user/:userId',
      element: <ManageUserProfile />,
    },
    //{ staish code
      //path: '/user/:userId',
      //element: <UserProfile />,
    //},
    {
      path: '/forgetPassword',
      element: <ForgetPassword />,
    },
    // {
    //   path: '/user/:userId',
    //   element: <EditUseProfile />,
    // },
    
  ],
};

export default userConfig;
