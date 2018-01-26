# ngx-anchor
angular 4+ custom anchor components. [DEMO][demo]

## todos
* [x] custom anchor mark directive
* [x] build-in anchor navigator
* [x] mult anchor level support
* [x] custom animation options
* [ ] ember layout support
* [x] public navigator service

## installing and usage
> ``npm install ngx-anchor --save``

### load module in app module (with or without global configuration)

```
// without configuration
imports: [
  ...
  NgxAnchorModule.forRoot(),
  ...
]

// with configuration
imports: [
  ...
  NgxAnchorModule.forRoot({
    duration: 1000,
    step: 10,
    sensitivity: 36
  }),
  ...
]
```

### configuration
* ``duration``(number): scroll animation total duration distance
* ``step``(number): the step per requestAnimationFrame
* ``sensitivity``(number): the offset which affects anchor navigator auto-active when trigger scroll events, default is 12px
* ``timeFunc``: scroll animation time function used, signature is 
```
funciton timeFunc(step: number, start: number, change: number, duration: number) => number
```

## directives
### ``ngxAnchor``
custom anchor mark

* ``ngxAnchor``(string): anchor custom id

example:
```
<h1 [ngxAnchor]="foo">main title{{foo}}</h1>
```

### ``ngxWithAnchor``
parent anchor mark

* ``ngxWithAnchor``(string): parent anchor id

example:
```
<h1 [ngxAnchor]="foo" [header]="true">main title{{foo}}</h1>
<section [ngxWithAnchor]="foo">
  <h2 [ngxAnchor]="bar">sub main title{{bar}}</h2>
</section>
```

## components
### ``ngx-anchor-nav``
build-in anchor navigator

* ``anchorTpl``(TemplateRef)

example:
```
<ngx-anchor-nav>
  <ng-template #anchorTpl let-index="id">
    <span>{{index}}</span>
  </ng-template>
</ngx-anchor-nav>
```

## services
### AnchorService
#### property
* ``anchors``( { [id: string]: anchor: Anchor} ): all regisitry custom anchor instance
* ``activeAnchor``(Anchor): current active anchor instance
* ``scrollEvents``(Observable<Anchor>): current active anchor Observable

#### method
```
anchorFactory(el: HTMLElement, constraint: AnchorRelConstriant): Anchor
```
anchor instance factory with el

```
get(id: string): Anchor
```
retrive anchor instance by id 

```
register(el: HTMLElement, constraint: AnchorRelConstriant)
```
register el as anchor instance

```
scrollTo(anchor: Anchor | string, scrollOptions?: AnchorScrollConfig)
```
scroll to some anchor instance with custom animation options

```
attachListner(el: HTMLElement | Window = window): Observable<Anchor>
```
attach scroll listner to container element, default is ``window``



[demo]: http://littlelyon.com/ngx-anchor/
