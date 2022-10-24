import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { HomeService } from "../_services/home.service"
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TreeService } from '../_services/tree.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

	content?: string;

	lang: string = "en"
	type: string = "rmt"

	//user variables
	userList: Array<{ name: string, access: Array<Object> }> = []
	curUser: any | null = {}

	//username popover variables
	username: string = ""
	popoverVisible: boolean = false
	popoverChange(e: boolean) {
		if (e === false)
			this.username = ""
	}

	//treedata variables
	enAvailables: Array<Object> = []
	frAvailables: Array<Object> = []

	availableExpands: Array<Object> = []
	availableChecked: Array<Object> = []

	enLocations: Array<Object> = []
	frLocations: Array<Object> = []

	locationExpands: Array<Object> = []
	locationChecked: Array<Object> = []

	constructor(
		private userService: UserService,
		private delConfirmModal: NzModalService,
		private homeService: HomeService,
		private message: NzMessageService,
		private treeService: TreeService
	) { }

	ngOnInit(): void {
		this.getInitialData()
	}

	getInitialData(): void {
		this.homeService.getInitialData(this.type).subscribe({
			next: res => {

				if (res.data && res.data.length > 0) {
					let { enTreeData, frTreeData } = this.treeService.convertData(res.data)
					this.enAvailables = this.treeService.setChildCount(enTreeData, "orgCnt");
					this.frAvailables = frTreeData;
					this.availableExpands = ["10"];	//open canada node by default
				} else {
					this.enAvailables = []
				}
				if (res.users && res.users.length > 0) {
					this.userList = res.users;
					this.curUser = res.users[0]
				} else {
					this.userList = [];
					this.curUser = null;
				}
				this.updateLocationTree()
			},
			error: err => {
				this.userList = []
				this.curUser = null;
				this.showError(err)
			}
		})
	}

	setLang(lang: string): void {
		this.lang = lang;
	}

	showDeleteConfirm(): void {
		if (!this.curUser) {
			this.message.error("Sorry, Invaild UserId")
			return;
		}

		if (this.curUser.access && this.curUser.access.length > 0) {
			this.message.error("Sorry, Remove access first.")
			return;
		}

		this.delConfirmModal.confirm({
			nzTitle: 'Are you sure?',
			nzContent: `<b style="color: red;">You want to delete <i>${this.curUser.name}</i>?</b>`,
			nzOkText: 'Yes',
			nzOkType: 'primary',
			nzOkDanger: true,
			nzOnOk: () => {
				this.homeService.deleteUser({ type: this.type, name: this.curUser.name }).subscribe({
					next: res => {
						this.message.success("UserId is deleted successfully.")
						this.userList = this.userList.filter(item => item.name !== this.curUser.name)
						if (this.userList.length > 0) {
							this.curUser = this.userList[0]
							this.updateLocationTree()
						}
						else this.curUser = null
					},
					error: err => {
						this.showError(err)
					}
				})
			},
			nzCancelText: 'No',
			nzOnCancel: () => console.log('Cancel')
		});
	}

	addUser(): void {
		if (this.username.trim() === "") {
			this.message.error("Sorry, Invaild UserId")
			return;
		}

		let find = this.userList.find((item) => item.name === this.username.trim())
		if (find) {
			this.message.error("Sorry, UserId is duplicated.")
			return;
		}

		this.homeService.addUser(this.username, this.type).subscribe({
			next: res => {
				this.userList.push(res)
				this.popoverVisible = false
				this.message.success("UserId added successfully.")
				if (!this.curUser) {
					this.curUser = this.userList[0]
					this.updateLocationTree();
				}
			},
			error: err => {
				this.showError(err)
			}
		})
	}

	changeType(type: string): void {
		this.type = type;
		this.getInitialData();
	}

	changeUser(data: any): void {
		this.updateLocationTree()
	}

	updateLocationTree() {
		if (!this.curUser){
			this.enLocations = []
			return;
		}
		this.enLocations = this.treeService.filterTree(this.enAvailables, this.curUser.access)
		this.locationExpands = ["10"]
	}

	showError(err: any): any {
		if (err.error && err.error.message)
			return this.message.error(err.error.message)
		if (err.message)
			return this.message.error(err.message)
		if (err.data && err.data.message)
			return this.message.error(err.data.message)
	}

	treeActions({ type, actionType }: any): void {
		if (type === "available") {
			if (actionType === "checkAll") {
				this.availableChecked = ["10"];
				// this.treeService.getChildNodeIds()
			} else if (actionType === "uncheckAll") {
				this.availableChecked = [];
			} else if (actionType === "expandAll") {
				this.availableExpands = this.treeService.getNodeIds(this.enAvailables)
			} else if (actionType === "collapseAll") {
				this.availableExpands = []
			}
		}

		if (type === "location") {
			if (actionType === "checkAll") {
				this.locationChecked= ["10"];
			} else if (actionType === "uncheckAll") {
				this.locationChecked = [];
			} else if (actionType === "expandAll") {
				this.locationExpands = this.treeService.getNodeIds(this.enAvailables)
			} else if (actionType === "collapseAll") {
				this.locationExpands = []
			}
		}
	}

	treeChangeEvent({ type, event }: any) {
		if (type === "available")
			this.availableChecked = this.treeService.getCheckedLeaf(event.checkedKeys);
		if (type === "location")
			this.locationChecked = this.treeService.getCheckedLeaf(event.checkedKeys);
	}

	moveToLeft() {
		let locationIds = this.treeService.getChildNodeIds(this.enLocations);
		var arr = locationIds.filter((item: any) => this.locationChecked.indexOf(item + "") === -1);
		this.enLocations = this.treeService.filterTree(this.enLocations, arr);
	}

	moveToRight() {
		this.enLocations = this.treeService.filterTree(this.enAvailables, this.availableChecked.concat(this.treeService.getChildNodeIds(this.enLocations)))
		this.availableChecked = [];
		this.locationChecked = [];
	}

	saveUserAccess(): void {
		this.enLocations = this.treeService.setChildCount(this.enLocations, "cnt")
		let checkedKeys = this.treeService.getSameChildCount(this.enLocations)
		this.homeService.saveAccess({ type: this.type, name: this.curUser.name, access: checkedKeys }).subscribe({
			next: () => {
				this.message.success("User access updated successfully.")
				this.userList = this.userList.map(item => {
					if (item.name === this.curUser.name)
						return { ...item, access: checkedKeys }
					return item
				})
			},
			error: err => {
				this.showError(err)
			}
		})
	}
}
