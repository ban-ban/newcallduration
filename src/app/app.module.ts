import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GroupPage } from '../pages/group/group';
import { NewGroupPage } from '../pages/newgroup/newgroup';
import { PipesModule} from '../pipes/pipes.module';

//provider
import { Contacts } from '@ionic-native/contacts';

import { IonicStorageModule } from '@ionic/storage';
import { CallLog } from '@ionic-native/call-log';

import { GroupListService } from '../providers/group-list/group-list';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GroupPage,
    NewGroupPage
  ],
  imports: [
    BrowserModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GroupPage,
    NewGroupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Contacts,
    CallLog,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GroupListService
  ]
})
export class AppModule {}
