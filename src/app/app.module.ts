import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Geolocation } from '@ionic-native/geolocation';


import { Page1 } from '../pages/page1/page1';
import { LoginPage } from '../pages/login/login';
import { CommentsPage } from '../pages/comments/comments';
import { RegisterPage } from '../pages/register/register';
import { PostPage } from "../pages/post/post";
import { SuggestionsPage } from "../pages/suggestions/suggestions";
import { ChatPage } from "../pages/chat/chat";
import { DeliveryPage } from "../pages/delivery/delivery";
import { DeliveryFormPage } from "../pages/delivery-form/delivery-form";
import { UsersPage } from "../pages/users/users";
import { RecentPage } from "../pages/recent/recent";
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from "../pages/search/search";
import { MapPage } from '../pages/map/map';


import { UserServices } from '../providers/user-services';
import { PostServices } from '../providers/post-services';
import { Preloader } from '../providers/preloader';
import { ChatServices } from "../providers/chat-services";



@NgModule({
  declarations: [
    MyApp,
    Page1,
    LoginPage,
    RegisterPage,
    ProfilePage,
    CommentsPage,
    PostPage,
    SuggestionsPage,
    ChatPage,
    DeliveryPage,
    DeliveryFormPage,
    UsersPage,
    RecentPage,
    SearchPage,
    MapPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    LoginPage,
    RegisterPage,
    ProfilePage,
    CommentsPage,
    PostPage,
    SuggestionsPage,
    ChatPage,
    DeliveryPage,
    DeliveryFormPage,
    UsersPage,
    RecentPage,
    SearchPage,
    MapPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},UserServices,PostServices,Preloader,ChatServices,Geolocation]
})
export class AppModule {}
