# T<sup>-1</sup>
EcmaScript 6's Template String in by

EcmaScript 6 introduces the [Template String] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings),
which supports binding to Javascript expressions.  A common use case for this feature is for "stringifying" a JavaScript object.

For example:

```javascript
    var customerInfo = {
        firstName:  'Harrison',
        lastName:  'Ford'
    };

    console.log(`Hello, ${customerInfo.firstName} ${customerInfo.lastName`,)
    //output:  "Hello, Harrison Ford"
```

If we restrict the allowed expressions to be properties of a single object, we can think of this template string as a transform from an object to a 
string:

```typescript
    T: Object => string;
```

What T<sup>-1</sup> does is reverse the process.  Given a template string, and the result of this transform, find an object which would generate such
a string.  Of course, like many equations in mathematics, there may be no such object which will work, or there could be multiple objects which produce
the same output when applied to the template string.  To take some examples, suppose the template string

```typescript
    var generator = t_1.compile<TObj>(`${obj.stringProperty1}th${obj.stringProperty2}th${obj.stringProperty3}`);
    var myObj = generator.parse("Is this the face that launched a thousand ships?");
```
obj.stringProperty1 = "Is ";
obj.stringProperty2 = "is the face that launched a ";
obj.stringProperty3 = "ousand ships?";

or

obj.stringProperty1 = "Is ";
obj.stringProperty2 = "is ";
obj.stringProperty3 = "e face that launched a thousand ships?";

The T-1 transform library will allow you to iterate through all such possibilities

You can specify optional matches.  For example:

```typescript
    `const ${obj.varName} = ${obj.varVal}; ${t_1.opt`//${obj.comment}`}`
```

populates the comment comes after '//', but it is optional.  If no comment characters
are found, then comment becomes null.

