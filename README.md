# Flowrest

A fluent javascript REST client that works directly in the browser

Introduction
===

I made this library because I couldn't find a REST API library that just worked out of the box in the browser. But I figured, hey, if I make one, why not make one thats minimal, elegant and stylish!

Hence Flowrest, a tiny(~5KB) javascript library that exposes a fluent interface to your REST resources, and lets you chain them to make API calls.

The 2-minute Tutorial
---

Grab a copy of the script at https://github.com/bitonator/flowrest/raw/master/flowrest.js (right click -> Download)

First configure your API by creating an instance of the `flowrestapi` object, providing a base URL and the heirarchy of resources.

    var api=new flowrestapi({
        baseUrl: "http://api.example.com/",
        resources: [
            "authors",
            "books",
            "books/authors",
            "publications",
            "publications/books"
        ]
    });

Then get the root object of your `flowrestapi` object, and access its resources to make calls. 
    
    var root=api.root();
    
    var promise=root.publications.m(1).books.GET({limit=20, offset=0})
    
    promise.then(Function(response, data) {
        var booklist=data.results;
        ....  
    }).error(function(response, error) {
        conole.log("We got an error!");
    })

Defining and accessing resources
---

The hierarchy of resources is only meant to describe the relationship between reosurces. So if you had an API call like `/publications/{id}/books`, then your resource description would be simply, `publications/books`. 

Flowrest automatically provides methods to chain resources both at a member and collection level. So with `publications/books` as a resource description, you'll be able to chain resources  at the collection level with `root.publications.books` and at the member level via `root.publications.m(id).books`

Dial M for Member
---

All reosurces have a member resolution function called `m`. You use this function to insert the identifier of the member. For example, if you wanted to get a book with id `4`, you'd do:

    root.books.m(4).GET()
    
This could be a string or a tag too, like
    
    root.books.m("my-favorite").GET()
    
Headers
---

The `flowrestapi` object stores configuration that are used across all calls that access the resources of that API. 

To define a header to be added to all calls, simply use the `addHeader` function like so:

    api.addHeader("Authorization", "Bearer ABCD");
    
Once you do this, any call on any resource belonging to `api` will send this header.

Multiple APIs and Microservices
---

Using multiple APIs is a breeze in Fluentrest, all you need to do is create different `flowrestapi` objects for different APIs.

    var ourApi=new FluentRestApiConfig({...});
    var theirApi=new FluentRestApiConfig({...});
    
    var ourRoot=ourApi.root();
    var theirRoot=theirApi.root();
    
Moreover, settings like headers etc. are API config specific, so you can set headers on `ourApi` without affecting `theirApi`.

Caveat: One root for one resource
---

Ensure that you create a separate root object for each resource, otherwise you'll get unexpected consequences. For example, if you do

    var root=api.root();
    var res1=root.publications.m(1).books;
    var res2=root.publications.m(2).books;
    
then both res1 and res2 will end up pointing to `publications/2/books/`.

Please don't copy?
---

A few libraries I made were blatantly forked and publicised without my consent.

Fluentrest is not just a library, its a culmination of many years of experience in designing and building systems.

Please think about that for a bit before you decide to do what you do

