#querystring

Simple querystring lib with no dependencies.  Mimics the node querystring library.

##Installation

###Bower

`bower install querystring`

###Manual Download

- [Development]()
- [Production]()

##Usage

###Parse

```javascript
//url http://localhost/?foo=bar&cow=moo
querystring.parse(); //no argument passed in assumes window.location.search
// returns { foo: 'bar', cow: 'moo' }
```

```javascript
querystring.parse('foo=bar&baz=qux&baz=quux&corge')
// returns { foo: 'bar', baz: ['qux', 'quux'], corge: '' }
```

###Stringify
```javascript
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
// returns 'foo=bar&baz=qux&baz=quux&corge='
```

##Development

###Requirements

- node and npm
- bower `npm install -g bower`
- grunt `npm install -g grunt-cli`

###Setup

- `npm install`
- `bower install`

###Run

`grunt dev`

or for just running tests on file changes:

`grunt ci`

###Tests

`grunt mocha`
