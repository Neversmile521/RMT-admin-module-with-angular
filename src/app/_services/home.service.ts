import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from 'rxjs';
import { StorageService } from "./storage.service"

const API_URL = 'http://localhost:8080/api';

@Injectable({
	providedIn: 'root'
})
export class HomeService {

	constructor(private http: HttpClient, private storageServce: StorageService) { }

	getInitialData(type: string): Observable<any> {
		return this.http.get(`${API_URL}/initial/${type}`)
	}

	addUser(name: string, type: string): Observable<any> {
		return this.http.put(`${API_URL}/addUser`, { name, type }, { headers: { "x-access-token": this.storageServce.getToken() } })
	}

	deleteUser(data: any) {
		return this.http.delete(`${API_URL}/deleteUser/${data.type}/${data.name}`, { headers: { "x-access-token": this.storageServce.getToken() } })
	}

	saveAccess(data: any) {
		return this.http.post(`${API_URL}/updateAccess`, data, { headers: { "x-access-token": this.storageServce.getToken() } })
	}
}