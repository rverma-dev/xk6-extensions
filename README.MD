Building extensions

1. Build any extension as xk6 build latest --with github.com/nslhb/xk6-extensions/<extention_same>=.
```
xk6 build latest --with github.com/nslhb/xk6-extensions/cassandra=.
```
2. Build multiple extensions together
```
xk6 build latest --with github.com/nslhb/xk6-extensions/cassandra=. --with github.com/nslhb/xk6-extensions/sql=.
Note Buildtime with 2 extensions is very similar to buildtime with a single extension here
```