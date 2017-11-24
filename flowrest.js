var flowrestapi=(function() {
function FlowRestPromise() {
    this.then=function(thenFn) {
        this.thenFn=thenFn;
        return this;
    }

    this.error=function(errorFn) {
        this.errorFn=errorFn;
        return this;
    }
}

function FlowRestResource(name, config) {
    this.__name__=name;
    this.__config__=config;
    this.__id__=null;

    this.__path__=function() {
        if(this.__name__=="root")
            return ""
        else {
            var path=this.root.__path__()+this.__name__+"/";
            if(this.__id__!=null)
                path=path+this.__id__+"/"
            return path;
        }
    }

    this.m=function(id) {
        this.__id__=id;
        return this;
    }

    this.__apicall__=function(method, queryParams, bodyParams) {
        this.request=new XMLHttpRequest();
        var self=this;
        this.request.onreadystatechange=function() {
            self.onReadyStateChange();
        }
        this.promise=new FlowRestPromise();
        var url=this.__config__.baseUrl+this.__path__();

        for(var header in this.__config__.headers) {
            request.setRequestHeader(header, this.__config__.headers[header]);
        }
        
        var firstQueryParam=true;
        for(var queryParam in queryParams) {
           if(firstQueryParam==true) {
               url=url+"?"+queryParam+"="+queryParams[queryParam];
               firstQueryParam=false;
           } else {
               url=url+"&"+queryParam+"="+queryParams[queryParam];
           }
        }

        var body="";
        var firstBodyParam=true;
        for(var bodyParam in bodyParams) {
           if(firstBodyParam==true) {
               body=bodyParam+"="+bodyParams[bodyParam];
               firstBodyParam=false;
           } else {
               body=body+"&"+bodyParam+"="+bodyParams[bodyParam];
           }
        }

        if(method=="GET" || method=="DELETE") {
            console.log(method+" "+url);
            this.request.open(method, encodeURI(url), true);
            this.request.send();
        } else {
            this.request.open(method, encodeURI(url), true);
            this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // console.log(body);
            this.request.send(body);
        }

        return this.promise;
    }

    this.onReadyStateChange=function() {
        switch(this.request.readyState) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                if(this.request.status>=200 && this.request.status<300)
                    if(this.promise.thenFn) 
                        this.promise.thenFn(this.request, JSON.parse(this.request.responseText));
                if(this.request.status>=400)
                    if(this.promise.errorFn) 
                        this.promise.errorFn(this.request);
        } 
    }

    this.GET=function(params) {
        console.log("GET "+this.__path__());
        return this.__apicall__("GET", params);
    }

    this.POST=function(params) {
        console.log("POST "+this.__path__());
        return this.__apicall__("POST", {}, params);
    }

    this.PUT=function(params) {
        console.log("PUT "+this.__path__());
        return this.__apicall__("PUT", {}, params);
    }

    this.PATCH=function(params) {
        console.log("PATCH "+this.__path__());
        return this.__apicall__("PATCH", {}, params);
    }

    this.DELETE=function() {
        console.log("DELETE "+this.__path__());
        return this.__apicall__("DELETE", params);
    }

    this.__addChild__=function(name, resource) {
        // console.log("addChild: "+name);
        this[name]=resource; 
        resource.root=this;
    } 
}

function FlowRestResourceBuilder(name, root, resources) {
    this.name=name;
    this.root=root;
    this.children=[];

    this.path=function() {
        if(this.name=="root")
            return ""
        else {
            var path=this.root.path()+this.name+"/";
            return path;
        }
    }

    var path=this.path();
    for(var index in resources) {
        var resource=resources[index];
        var resourcePath=path.substring(0, path.length-1);
        // console.log(this.name+": Looking for "+resourcePath+" in "+resource);
        if(resource.indexOf(resourcePath)==0) {
            var childResourcePath=resource.substring(resourcePath.length);
            if(childResourcePath.indexOf("/")==0)
                childResourcePath=childResourcePath.substring(1);
            // console.log(this.name+": child resource path is "+childResourcePath);
            if(childResourcePath!="" && childResourcePath.indexOf("/")==-1) {
                // console.log(this.name+": Adding child resource "+childResourcePath);
                this.children[childResourcePath]=new FlowRestResourceBuilder(childResourcePath, this, resources);
            }
        }
    }

    this.build=function(config) {
        var root=new FlowRestResource(this.name, config);
        for(var index in this.children) {
            var child=this.children[index];
            // console.log(this.name+": adding resource "+child.name);
            root.__addChild__(child.name, child.build(config));
        } 
        return root;
    }
}

function FlowRestApiConfig(obj) {
    this.baseUrl=obj.baseUrl;
    this.resources=obj.resources;
    this.__root__=new FlowRestResourceBuilder("root", null, this.resources);

    this.root=function() {
        return this.__root__.build(this);
    }

    this.headers={}

    this.addHeader=function(name, value) {
        this.headers[name]=value;
    }
}

return FlowRestApiConfig;
}());




