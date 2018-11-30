import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';

import { GroupListService} from '../../providers/group-list/group-list' ;
import { Group } from '../../interfaces/group.interface';




@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
    groupName:any="";
    modifiedGroupName:any="";
    newMember:string;
    searchName:string;
    members:string[];
    phoneNumbers:string[];
    ids:string[];
    plus: boolean;
    readOnly: boolean;
    namereadOnly: boolean;
    myContacts: Contact[];
    groupIndex: number ;
    myGroup:Group;

    constructor(public navCtrl: NavController, public navParams: NavParams,private contacts: Contacts,private storage: Storage,private viewCtrl: ViewController, private _groupList:GroupListService) {
      this.groupIndex=this.navParams.get("groupIndex");
      this.myGroup=this._groupList.returnGroup(this.groupIndex);
      this.groupName=this.myGroup.name;
      //console.log(this.groupName);
      this.modifiedGroupName=this.groupName;
      this.newMember="nouveau membre";
      this.searchName="";
      this.plus=false;
      this.readOnly=false;
      this.namereadOnly=false;
      this.myContacts=[];
      this.members=this.myGroup.members;
      this.phoneNumbers=this.myGroup.phoneNumbers;
      this.ids=this.myGroup.ids;
      
      // this.members=["M.Bertrand","Jeremy","Damien Roig"];
    }

    findContacts(){
      this.myContacts=[];
      this.contacts.find(['displayName'], {filter: this.searchName}).then((results)=>{
          this.myContacts=results;
          //console.log(results);
      });
    }

    selectContact(index: number){
      this.plus=false;
      this.members.push(this.myContacts[index].displayName);
      this.phoneNumbers.push(this.myContacts[index].phoneNumbers[0].value);
      this.ids.push(this.myContacts[index].id);
      this.readOnly=true;
    }

    removeMember(index:number) {
      
      this.members.splice(index,1);
      this.phoneNumbers.splice(index,1);
      this.ids.splice(index,1);
    }

    addMember(){
      this.myContacts=[];
      this.searchName="";

      this.plus=true; //new member item is not hidden anymore
      this.readOnly=false;
      
    }

    updateGroup(){
      //
      if (this.members.length>0){
        let groupList : Group[]=[];
       
        groupList = this._groupList.updateGroup(this.groupIndex, this.modifiedGroupName, this.members, this.phoneNumbers, this.ids);
         
        //groupList = this._groupList.returnGroupList();
        //recrée le groupe dans storage et option: enregistre la date de modifications
        this.storage.ready().then(()=>{
          this.storage.set("groupList",groupList).then( ()=> {
            this.viewCtrl.dismiss(false);
            });
          });
      
      }
      else {
        alert("at least one member");
      }
    }

    dismissModal(){
      this.viewCtrl.dismiss(true);
    }

}
