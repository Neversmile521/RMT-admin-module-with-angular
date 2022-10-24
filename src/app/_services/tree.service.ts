import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TreeService {

    filters: any = [];

    constructor() { }

    getChildCount(arry: any, srcData: any) {
        if (arry.length == 1) {
            let count = 0;
            srcData.forEach((element: any) => {
                if (element.REGION_ENG_NM === arry[0])
                    count++;
            });
            return count;
        }
        if (arry.length == 2) {
            let count = 0;
            srcData.forEach((element: any) => {
                if (element.REGION_ENG_NM === arry[0] && element.RESP_ENG_NM === arry[1])
                    count++;
            });
            return count;
        }
        return 0;
    }

    convertData(data: any) {
        let enTreeData = [], frTreeData = [];
        for (let i = 0; i < data.length; i++) {
            let rootFind = false;
            for (let j = 0; j < enTreeData.length; j++) {
                let subFind = false;
                if (enTreeData[j].title === data[i].REGION_ENG_NM) {
                    rootFind = true;
                    for (let k = 0; k < enTreeData[j].children.length; k++) {
                        if (enTreeData[j].children[k].title === data[i].RESP_ENG_NM.trim()) {
                            subFind = true;
                            let grandFind = false
                            for (let l = 0; l < enTreeData[j].children[k].children.length; l++) {
                                if (enTreeData[j].children[k].children[l] === data[i].SUBRESP_ENG_NM.trim())
                                    grandFind = true;
                            }
                            if (!grandFind) {
                                enTreeData[j].children[k].children.push({
                                    title: data[i].SUBRESP_ENG_NM.trim(),
                                    key: data[i].SUBRESP_ENG_NM.trim().substr(0, 5),
                                    isLeaf: true
                                })
                                frTreeData[j].children[k].children.push({
                                    title: data[i].SUBRESP_FNR_NM.trim(),
                                    key: data[i].SUBRESP_FNR_NM.trim().substr(0, 5),
                                    isLeaf: true
                                })
                            }
                        }
                    }
                    if (!subFind) {
                        enTreeData[j].children.push({
                            key: data[i].SUBRESP_FNR_NM.trim().substr(0, 3),
                            title: data[i].RESP_ENG_NM.trim(),
                            children: [{
                                key: data[i].SUBRESP_ENG_NM.trim().substr(0, 5),
                                title: data[i].SUBRESP_ENG_NM.trim(),
                                isLeaf: true
                            }]
                        })
                        frTreeData[j].children.push({
                            key: data[i].SUBRESP_FNR_NM.trim().substr(0, 3),
                            title: data[i].RESP_FNR_NM.trim(),
                            children: [{
                                key: data[i].SUBRESP_FNR_NM.trim().substr(0, 5),
                                title: data[i].SUBRESP_FNR_NM.trim(),
                                isLeaf: true
                            }]
                        })
                    }
                }
            }
            if (!rootFind) {

                enTreeData.push({
                    key: data[i].SUBRESP_FNR_NM.trim().substr(0, 1),
                    title: data[i].REGION_ENG_NM,
                    children: [{
                        key: data[i].SUBRESP_FNR_NM.trim().substr(0, 3),
                        title: data[i].RESP_ENG_NM.trim(),
                        children: [{
                            key: data[i].SUBRESP_ENG_NM.trim().substr(0, 5),
                            title: data[i].SUBRESP_ENG_NM.trim(),
                            isLeaf: true
                        }]
                    }]
                })

                frTreeData.push({
                    key: data[i].SUBRESP_FNR_NM.trim().substr(0, 1),
                    title: data[i].REGION_FNR_NM,
                    children: [{
                        key: data[i].SUBRESP_FNR_NM.trim().substr(0, 3),
                        title: data[i].RESP_FNR_NM.trim(),
                        children: [{
                            key: data[i].SUBRESP_FNR_NM.trim().substr(0, 5),
                            title: data[i].SUBRESP_FNR_NM.trim(),
                            isLeaf: true
                        }]
                    }]
                })
            }
        }
        enTreeData = [{
            key: "10",
            title: "Canada",
            children: enTreeData
        }]
        frTreeData = [{
            key: '10',
            title: "Canada",
            children: frTreeData
        }]
        return {
            enTreeData,
            frTreeData
        }
    }

    getChildNodeIds(nodes: any) {
        let results: any = []

        const extractVal = (nodes: any) => {
            nodes.forEach((e: any) => {
                if (!e.children)
                    results.push((e.key));
                if (e.children) {
                    extractVal(e.children);
                }
            });
        };

        extractVal(nodes);
        return results
    }

    getNodeIds(nodes: any) {
        let ids: any = [];
        nodes && nodes.forEach(({ key, children }: any) => {
            ids = [...ids, key, ...this.getNodeIds(children)];
        });
        return ids;
    }

    getCheckedLeaf(nodes: any) {
        let results: any = []

        const extractVal = (nodes: any) => {
            nodes.forEach((e: any) => {
                if (e._isLeaf)
                    results.push((e.key));
                if (e.children) {
                    extractVal(e._children);
                }
            });
        };

        extractVal(nodes);
        return results
    }

    filterTree(treeData: any, filters: any) {
        const filterNodes = (filtered: any, node: any) => {
            const children = (node.children || []).reduce(filterNodes, []);
            if (filters.indexOf(node.key + "") > -1 || filters.indexOf(node.key * 1) > -1 || children.length) {
                if (children.length > 0)
                    filtered.push({ ...node, children });
                else
                    filtered.push({ ...node });
            }

            return filtered;
        }
        const nodesFiltered = treeData.reduce(filterNodes, [])
        return nodesFiltered;
    }


    setChildCount(data: any, field: string) {
        const func = (filtered: any, node: any) => {
            const children = (node.children || []).reduce(func, []);
            let count = 0;
            if (children.length > 0) {
                children.forEach((element: any) => {
                    if (element[field])
                        count += element[field];
                });
                filtered.push({ ...node, children, [field]: count + children.length })
            } else
                filtered.push({ ...node })
            return filtered;
        }
        const nodes = data.reduce(func, [])
        return nodes;
    }

    getSameChildCount(data: any) {
        let results: any = []

        const extractVal = (nodes: any) => {
            nodes.forEach((e: any) => {
                if (!e.children)
                    results.push(e.key)
                else if (e.cnt === e.orgCnt)
                    results.push(e.key)
                else
                    extractVal(e.children);
            });
        };

        extractVal(data);
        return results
    }
}