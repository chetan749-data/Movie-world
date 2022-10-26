import { Component, OnInit,ViewChild,ElementRef, AfterViewInit } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { concat, Observable, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter, switchMap, pluck, concatMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ResultsService } from '../service/results.service';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Pipe } from '@angular/core';
const params= new HttpParams({
  fromObject:{
    action:'opensearch',
    Format:'json'
  }
})
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewInit {
  currentPage:number=1;
  url = 'https://demo.credy.in/api/v1/maya/movies/'
  @ViewChild('searchForm')
  searchForm!: NgForm;
  movieSearchInput!:ElementRef;
  isSearching !:boolean;
  content:any = [];
  contentArray:any=[];
  searchTerm:any
  totalPages:number=0;
  nextPageURL:any;
   movieTitle:any;
   ApiError=false;
  constructor( private http : HttpClient,private searchService: ResultsService) { 
    this.isSearching=false;
    this.content=[];
  }
  ngAfterViewInit():void {
    this.getdataFromAPI(this.currentPage)
    const formValue= this.searchForm.valueChanges;
    formValue?.pipe(
      // map(data =>data.searchTerm),
      
      // debounceTime(250),
      // distinctUntilChanged(),
      // switchMap(data=>this.getdataFromAPI(this.currentPage,this.searchTerm)) 
      
    )
    .subscribe(res =>{
      console.log('searchterm',res)
      this.searchTerm=res
      // console.log(formValue)
    })





    

  }

  getdataFromAPI(currentPage : number):any{
    if (this.searchTerm === '') {
      return of([]);
    }
    let limit:number=5;
    this.http.get(this.url +'?page='+this.currentPage).subscribe((data:any)=>{
      console.log('inside',this.searchTerm)
      this.content.push(...data.results);
      this.totalPages = data.count;
      
      this.nextPageURL=data.next.replace('undefined',this.searchTerm);
    },(err)=>{
      this.ApiError=true;      
      console.error(err);
    })
  }
  getSearchKeyword(event:any){
    // content2=this.content;
    if(event.target.value !==''){
      this.content= this.content.filter((searchTerm:any)=>{  
        var keyWord=event.target.value
        return searchTerm.title.includes(keyWord);
        })
    }
    else{
      this.getdataFromAPI(this.currentPage)
    }
    console.log('heloooo',this.content)
  }
  refresh(){
    this.getdataFromAPI(this.currentPage)
    this.ApiError=false
  }
  onScroll(event:any){
    let scrollHeight = event.target.scrollHeight;
    let scrollTop = event.target.scrollTop;
    let clientHeight = event.target.clientHeight;
    let scrollPosition = scrollHeight - (scrollTop + clientHeight);
    if(( scrollPosition < 1)  && this.totalPages > this.currentPage){
      this.currentPage++;
      this.getdataFromAPI(this.currentPage);
    }
  }
  validGenre(indexOfElement:number){
    if(this.content[indexOfElement].genres!==""){
      return true;
    }
    else{
      return false
    }
  }
getImageSource(indexOfElement:number){
    let imageURL=`https://ui-avatars.com/api/?rounded=true&&name=`+this.content[indexOfElement].title
    return imageURL
}
}



