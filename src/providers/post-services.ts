import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

import { Preloader } from "../providers/preloader";

/*
  Generated class for the PostServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PostServices {

  private userNode: any;
  public postsNode: any;
  public usersPostNode: any;
  private fireRef: any;
  private postReplyNode: any;
  public suggestionNode: any;
  public ratingNode: any;
  public ratingCommentNode: any;


  constructor(public http: Http, public preloader: Preloader) {
    this.userNode = firebase.database().ref('users');
    this.postsNode = firebase.database().ref('posts');
    this.usersPostNode = firebase.database().ref('user-posts');
    this.postReplyNode = firebase.database().ref('post-reply');
    this.fireRef = firebase.database().ref();
    this.suggestionNode = firebase.database().ref('WebPosts');
    this.ratingNode = firebase.database().ref('user-rating');
    this.ratingCommentNode = firebase.database().ref('rating-comments');

    
  }

  viewPostService(postId: any) {
    var userRef = this.postsNode.child(postId);
    return userRef.once('value');
  }

  viewUsersPostsService(userID: any) {
    var userRef = this.postsNode.child(userID);
    return userRef.once('value');
  }

  listPostReplies(postId: any) {
    var userRef = this.postReplyNode.child(postId);
    return userRef.once('value');
  }

  uploadImage(imageString: any, id: any): Promise<any> {
    //var newPostKey = this.postsNode.push().key;
    let image: string = 'image.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('posts/' + id + "/" + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (_snapshot) => {
        // We could log the progress here IF necessary
        console.log('snapshot progess ' + _snapshot);
      },
        (_err) => {
          reject(_err);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }

  editPostService(userId: any, postBody: any, displayName: any, photoUrl: any, category: any, subCat: any, title: any, photo: any, postKey: any, flag: boolean) {
    this.preloader.displayPreloader('Updating Your Post ...');
    var uploadedImage;
    var activity: number;
    activity = new Date().getTime().valueOf();
    activity = 0 - activity;
    if (flag) {
      this.uploadImage(photo, postKey).then((snapshot: any) => {
        uploadedImage = snapshot.downloadURL;

        var postData = {
          uid: userId,
          body: postBody,
          name: displayName,
          photo: photoUrl,
          category: category,
          subCategory: subCat,
          title: title,
          postPhoto: uploadedImage,
          activity: activity
        };

        var postData2 = {
          uid: userId,
          body: postBody,
          category: category,
          subCategory: subCat,
          title: title,
          postPhoto: uploadedImage,
          activity: activity

        };

        var updatePath = {};
        updatePath['/posts/' + postKey] = postData;
        updatePath['/user-posts/' + userId + "/" + postKey] = postData2;

        //update both tables simultaneously
        this.fireRef.update(updatePath).then(() => {
          this.preloader.hidePreloader();
          this.preloader.displayAlert('Done !', 'Post Sucessfully Updated !!');
        }, error => {
          this.preloader.hidePreloader();
          this.preloader.displayAlert('Failed !', error.message);
        })
      })
    }
    else {
      var postData = {
        uid: userId,
        body: postBody,
        name: displayName,
        photo: photoUrl,
        category: category,
        subCategory: subCat,
        title: title,
        postPhoto: photo,
        activity: activity


      };

      var postData2 = {
        uid: userId,
        body: postBody,
        category: category,
        subCategory: subCat,
        title: title,
        postPhoto: photo,
        activity: activity


      };

      var updatePath = {};
      updatePath['/posts/' + postKey] = postData;
      updatePath['/user-posts/' + userId + "/" + postKey] = postData2;

      //update both tables simultaneously
      this.fireRef.update(updatePath).then(() => {
        this.preloader.hidePreloader();
        this.preloader.displayAlert('Done !', 'Post Sucessfully Updated !!');
      }, error => {
        this.preloader.hidePreloader();
        this.preloader.displayAlert('Failed !', error.message);
      })
    }

  }

  createPostService(userId: any, postBody: any, displayName: any, photoUrl: any, category: any, subCat: any, title: any, photo: any, flag: boolean) {
    this.preloader.displayPreloader('Adding Your Post ...');
    var newPostKey = this.postsNode.push().key;
    var uploadedImage;
    var activity: number;
    activity = new Date().getTime().valueOf();
    activity = 0 - activity;

    if (flag) {
      this.uploadImage(photo, newPostKey).then((snapshot: any) => {
        uploadedImage = snapshot.downloadURL;

        var postData = {
          uid: userId,
          body: postBody,
          name: displayName,
          photo: photoUrl,
          category: category,
          subCategory: subCat,
          title: title,
          postPhoto: uploadedImage,
          activity: activity
        };

        var postData2 = {
          uid: userId,
          body: postBody,
          category: category,
          subCategory: subCat,
          title: title,
          postPhoto: uploadedImage,
          activity: activity
        };

        var updatePath = {};
        updatePath['/posts/' + newPostKey] = postData;
        updatePath['/user-posts/' + userId + "/" + newPostKey] = postData2;

        //update both tables simultaneously
        this.fireRef.update(updatePath).then(() => {
          this.preloader.hidePreloader();
          this.preloader.displayAlert('Done !', 'Post Sucessful....');
        }, error => {
          this.preloader.hidePreloader();
          this.preloader.displayAlert('Failed !', error.message);
        })
      })
    }
    else {
      var postData = {
        uid: userId,
        body: postBody,
        name: displayName,
        photo: photoUrl,
        category: category,
        subCategory: subCat,
        title: title,
        activity: activity

      };

      var postData2 = {
        uid: userId,
        body: postBody,
        category: category,
        subCategory: subCat,
        title: title,
        activity: activity

      };

      var updatePath = {};
      updatePath['/posts/' + newPostKey] = postData;
      updatePath['/user-posts/' + userId + "/" + newPostKey] = postData2;

      //update both tables simultaneously
      this.fireRef.update(updatePath).then(() => {
        this.preloader.hidePreloader();
        this.preloader.displayAlert('Done !', 'Post Sucessful....');
      }, error => {
        this.preloader.hidePreloader();
        this.preloader.displayAlert('Failed !', error.message);
      })
    }

  }

  createCommentService(userId: any, postBody: any, displayName: any, photoUrl: any, postId: any) {
    var postData = {
      uid: userId,
      reply: postBody,
      name: displayName,
      photo: photoUrl
    };

    var newPostKey = this.postsNode.push().key;
    var updatePath = {}
    updatePath['/post-reply/' + postId + "/" + newPostKey] = postData;
    return this.fireRef.update(updatePath);
  }

  delete(userId: any, postId: any) {
    this.preloader.displayAlert('Delete', 'Are You Sure, You Want to Delete This Post !')
    this.usersPostNode.child(userId).child(postId).remove();
    this.postsNode.child(postId).remove();
    this.postReplyNode.child(postId).remove();
    firebase.storage().ref('posts/' + postId + '/image.jpg').delete();
  }

}

