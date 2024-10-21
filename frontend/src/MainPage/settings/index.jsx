/* eslint-disable react/prop-types */
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Genaral from './genaral'
import Email from './email'
import Payment from './payment'
import Currency from './currency'
import Grouppermission from './grouppermission'
import Createpermission from './createpermission'
import Editpermission from './Editpermission'
import Taxrates from './taxrates'
import GeneralSettingsList from './generalSettingsList';
import EditEmailSettings from './editEmail';






const UserIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/generalsettingslist`} />
        <Route path={`${match.url}/generalsettings`} component={Genaral} />
        <Route path={`${match.url}/generalsettingslist`} component={GeneralSettingsList} />
        <Route path={`${match.url}/emailsettings`} component={Email} />
        <Route path={`${match.url}/editemailsettings`} component={EditEmailSettings} />
        <Route path={`${match.url}/paymentsettings`} component={Payment} />
        <Route path={`${match.url}/currencysettings`} component={Currency} />
        <Route path={`${match.url}/grouppermissions`} component={Grouppermission} />
        <Route path={`${match.url}/createpermission`} component={Createpermission} />
        <Route path={`${match.url}/editpermission/:id`} component={Editpermission} />
        <Route path={`${match.url}/taxrates`} component={Taxrates} />



    </Switch>
)

export default UserIndex