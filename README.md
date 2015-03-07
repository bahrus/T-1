# T-1
EcmaScript 6's StringTemplate in reverse

EcmaScript 6 introduces the [StringTemplate] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings),
which supports binding to Javascript expressions.  A common use case for this feature is for "stringifying" a JavaScript object.

For example:

```javascript
    var customerInfo = {
        firstName:  'Harrison',
        lastName:  'Ford'
    };

    console.log(`Hello, ${customerInfo.firstName} ${customerInfo.lastName`,)
```