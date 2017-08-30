几乎每个大一点公司都有一个“运行时间长，维护的工程师换了一批又一批”的项目，如果参与到这样的项目中来，大部分人只有一个感觉——”climb the shit mountain“。所以我们经常会说谁谁谁写的代码就像排泄物一样，为了避免成为别人嘴里的谁谁谁，所以我写的代码一般不注明作者日期信息（抖机灵，其实是因为 Git 能够很好的管理这些信息），所以在项目中，我们应该编写可维护性良好的代码。同时，对于工程师而言，提高自身的编码能力和编写易于阅读和维护的代码，是提高开发效率和职业身涯中必做的事情。我在面试的时候发现很多面试者拥有所谓的多年工作经验，一直在平庸的写着重复的代码，而从未去推敲、提炼和优化，这样是不可能提高编程水平的。

那么如何编写出可维护的、优雅的代码呢？

首先，我们应该明确的认识到，代码是写个自己和别人看的，代码应该保持清晰的结构，方便后人阅读和维护，假如有一天需要回头修改代码，别人和你都会感谢你！

其次，不管公司大小，不管项目大小，不管工期有多紧张，制定良好的编码规范并落到实地。如果代码质量不够好的话，在需求较多的情况下，就可能会牵一发动全身，大厦将倾。所以在项目的开始或者 **现在** 制定良好的编码规范，每个人都应该有自己的或者团队的编码规范，这样你的程序之路会走的更远！

最后，嗅出代码的 Bad Smell，比如重复的代码、命名不规范、过长的函数、数据泥团等等，然后在不改变代码外在行为的前提下，不断的优化重构，以改进代程序的内部结构。

接下来，我总结整理了一大套理论和实操，以飨各位。

### 避免使用 js 糟粕和鸡肋

这些年来，随着 HTML5 和 Node.js 的发展，JavaScript 在各个领域遍地开花，已经从“世界上最被误解的语言”变成了“世界上最流行的语言”。但是由于历史原因，JavaScript 语言设计中还是有一些糟粕和鸡肋，比如：全局变量、自动插入分号、typeof、NaN、假值、==、eval 等等，并不能被语言移除，开发者一定要避免使用这些特性，还好下文中的 ESLint 能够检测出这些特性，给出错误提示（如果你遇到面试官还在考你这些特性的话，那就需要考量一下，他们的项目中是否仍在使用这些特性，同时你也应该知道如何回答这类问题了）。

### 编写简洁的 JavaScript 代码

以下这些准则来自 Robert C. Martin 的书 “Clean Code”，适用于 JavaScript。 [整个列表](https://github.com/ryanmcdermott/clean-code-javascript)很长，我选取了我认为最重要的一部分，也是我在项目用的最多的一部分，但是还是推荐大家看一下原文。这不是风格指南，而是 **使用 JavaScript 生产可读、可重用和可重构的软件的指南**。

#### 变量

##### 使用有意义，可读性好的变量名

**Bad:**

``` javascript
var yyyymmdstr = moment().format('YYYY/MM/DD');
```

**Good:**

```
var yearMonthDay = moment().format('YYYY/MM/DD');
```

##### 使用 ES6 的 const 定义常量

反例中使用"var"定义的"常量"是可变的，在声明一个常量时，该常量在整个程序中都应该是不可变的。

**Bad:**

```
var FIRST_US_PRESIDENT = "George Washington"
```

**Good:**

```
const FIRST_US_PRESIDENT = "George Washington";
```

##### 使用易于检索的名称

我们要阅读的代码比要写的代码多得多， 所以我们写出的代码的可读性和可检索性是很重要的。使用没有意义的变量名将会导致我们的程序难于理解，将会伤害我们的读者， 所以请使用可检索的变量名。 类似 [buddy.js](https://github.com/danielstjules/buddy.js) 和 [ESLint](https://github.com/eslint/eslint/blob/660e0918933e6e7fede26bc675a0763a6b357c94/docs/rules/no-magic-numbers.md) 的工具可以帮助我们找到未命名的常量。

**Bad:**

```
// What the heck is 86400000 for?
setTimeout(blastOff, 86400000);
```

**Good:**

```
// Declare them as capitalized `const` globals.
const MILLISECONDS_IN_A_DAY = 86400000;

setTimeout(blastOff, MILLISECONDS_IN_A_DAY);
```

##### 使用说明性的变量(即有意义的变量名)

**Bad:**

```
const address = 'One Infinite Loop, Cupertino 95014'
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/
saveCityZipCode(address.match(cityZipCodeRegex)[1], address.match(cityZipCodeRegex)[2])
```

**Good:**

```
const address = 'One Infinite Loop, Cupertino 95014';
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/;
const [, city, zipCode] = address.match(cityZipCodeRegex) || [];
saveCityZipCode(city, zipCode);
```

#### 方法

##### 保持函数功能的单一性

这是软件工程中最重要的一条规则，当函数需要做更多的事情时，它们将会更难进行编写、测试、理解和组合。当你能将一个函数抽离出只完成一个动作，他们将能够很容易的进行重构并且你的代码将会更容易阅读。如果你严格遵守本条规则，你将会领先于许多开发者。

**Bad:**

```
function emailClients(clients) {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client)
    if (clientRecord.isActive()) {
      email(client)
    }
  })
}
```

**Good:**

```
function emailActiveClients(clients) {
  clients
    .filter(isActiveClient)
    .forEach(email);
}

function isActiveClient(client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

##### 函数名应明确表明其功能（见名知意）

**Bad:**

```
function addToDate(date, month) {
  // ...
}

const date = new Date();

// It's hard to to tell from the function name what is added
addToDate(date, 1);
```

**Good:**

```
function addMonthToDate(month, date) {
  // ...
}

const date = new Date();
addMonthToDate(1, date);
```

##### 使用默认变量替代短路运算或条件

**Bad:**

```
function createMicrobrewery(name) {
  const breweryName = name || 'Hipster Brew Co.';
  // ...
}
```

**Good:**

```
function createMicrobrewery(breweryName = 'Hipster Brew Co.') {
  // ...
}
```

##### 函数参数 (理想情况下应不超过 2 个)

限制函数参数数量很有必要，这么做使得在测试函数时更加轻松。过多的参数将导致难以采用有效的测试用例对函数的各个参数进行测试。

应避免三个以上参数的函数。通常情况下，参数超过三个意味着函数功能过于复杂，这时需要重新优化你的函数。当确实需要多个参数时，大多情况下可以考虑这些参数封装成一个对象。

**Bad:**

```
function createMenu(title, body, buttonText, cancellable) {
  // ...
}
```

**Good:**

```
function createMenu({ title, body, buttonText, cancellable }) {
  // ...
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true
});
```

##### 移除重复代码

重复代码在 Bad Smell 中排在第一位，所以，竭尽你的全力去避免重复代码。因为它意味着当你需要修改一些逻辑时会有多个地方需要修改。

重复代码通常是因为两个或多个稍微不同的东西， 它们共享大部分，但是它们的不同之处迫使你使用两个或更多独立的函数来处理大部分相同的东西。 移除重复代码意味着创建一个可以处理这些不同之处的抽象的函数/模块/类。

**Bad:**

```
function showDeveloperList(developers) {
  developers.forEach((developer) => {
    const expectedSalary = developer.calculateExpectedSalary();
    const experience = developer.getExperience();
    const githubLink = developer.getGithubLink();
    const data = {
      expectedSalary,
      experience,
      githubLink
    };

    render(data);
  });
}

function showManagerList(managers) {
  managers.forEach((manager) => {
    const expectedSalary = manager.calculateExpectedSalary();
    const experience = manager.getExperience();
    const portfolio = manager.getMBAProjects();
    const data = {
      expectedSalary,
      experience,
      portfolio
    };

    render(data);
  });
}
```

**Good:**

```
function showEmployeeList(employees) {
  employees.forEach((employee) => {
    const expectedSalary = employee.calculateExpectedSalary();
    const experience = employee.getExperience();

    const data = {
      expectedSalary,
      experience
    };

    switch (employee.type) {
      case 'manager':
        data.portfolio = employee.getMBAProjects();
        break;
      case 'developer':
        data.githubLink = employee.getGithubLink();
        break;
    }

    render(data);
  });
}
```

##### 避免副作用

当函数产生了除了“接受一个值并返回一个结果”之外的行为时，称该函数产生了副作用。比如写文件、修改全局变量或将你的钱全转给了一个陌生人等。程序在某些情况下确实需要副作用这一行为，这时应该将这些功能集中在一起，不要用多个函数/类修改某个文件。用且只用一个 service 完成这一需求。

**Bad:**

```
const addItemToCart = (cart, item) => {
  cart.push({ item, date: Date.now() });
};
```

**Good:**

```
const addItemToCart = (cart, item) => {
  return [...cart, { item, date: Date.now() }];
};
```

##### 避免条件判断

这看起来似乎不太可能。大多人听到这的第一反应是：“怎么可能不用 if 完成其他功能呢？”许多情况下通过使用多态(polymorphism)可以达到同样的目的。第二个问题在于采用这种方式的原因是什么。答案是我们之前提到过的：保持函数功能的单一性。

**Bad:**

```
class Airplane {
  //...
  getCruisingAltitude() {
    switch (this.type) {
      case '777':
        return getMaxAltitude() - getPassengerCount()
      case 'Air Force One':
        return getMaxAltitude()
      case 'Cessna':
        return getMaxAltitude() - getFuelExpenditure()
    }
  }
}
```

**Good:**

```
class Airplane {
  //...
}

class Boeing777 extends Airplane {
  //...
  getCruisingAltitude() {
    return getMaxAltitude() - getPassengerCount()
  }
}

class AirForceOne extends Airplane {
  //...
  getCruisingAltitude() {
    return getMaxAltitude()
  }
}

class Cessna extends Airplane {
  //...
  getCruisingAltitude() {
    return getMaxAltitude() - getFuelExpenditure()
  }
}
```

### 使用 ES6/ES7 新特性

##### 箭头函数

**Bad:**

```
function foo() {
  // code
}
```

**Good:**

```
let foo = () => {
  // code
}
```

#####  模板字符串

**Bad:**

```
var message = 'Hello ' + name + ', it\'s ' + time + ' now';
```

**Good:**

```
const message = `Hello ${name}, it's ${time} now`;
```

##### 解构

**Bad:**

```
var data = { name: 'dys', age: 1 };
var name = data.name,
    age = data.age;
```

**Good:**

```
const data = {name:'dys', age:1}; 
const {name, age} = data; 
```

##### 使用 ES6 的 classes 而不是 ES5 的 Function

典型的 ES5 的类(function)在继承、构造和方法定义方面可读性较差。当需要继承时，优先选用 classes。

**Bad:**

```
// 那个复杂的原型链继承就不贴代码了
```

 **Good：**

```
class Animal {
  constructor(age) {
    this.age = age;
  }

  move() { /* ... */ }
}

class Mammal extends Animal {
  constructor(age, furColor) {
    super(age);
    this.furColor = furColor;
  }

  liveBirth() { /* ... */ }
}

class Human extends Mammal {
  constructor(age, furColor, languageSpoken) {
    super(age, furColor);
    this.languageSpoken = languageSpoken;
  }

  speak() { /* ... */ }
}
```

##### Async/Await 是比 Promise 和回调更好的选择

回调不够整洁，并会造成大量的嵌套，ES6 内嵌了 Promises，但 ES7 中的 async 和 await 更胜过 Promises。

Promise 代码的意思是：“我想执行这个操作，然后(then)在其他操作中使用它的结果”。await 有效地反转了这个意思，使得它更像：“我想要取得这个操作的结果”。我喜欢，因为这听起来更简单，所以尽可能的使用 async/await。

**Bad:**

```
require('request-promise').get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
  .then(function(response) {
    return require('fs-promise').writeFile('article.html', response);
  })
  .then(function() {
    console.log('File written');
  })
  .catch(function(err) {
    console.error(err);
  })
```

**Good:**

```
async function getCleanCodeArticle() {
  try {
    var request = await require('request-promise')
    var response = await request.get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin');
    var fileHandle = await require('fs-promise');

    await fileHandle.writeFile('article.html', response);
    console.log('File written');
  } catch(err) {
    console.log(err);
  }
}
```

### Babel

ES6 标准发布后，前端人员也开发渐渐了解到了ES6，但是由于兼容性的问题，仍然没有得到广泛的推广，不过业界也用了一些折中性的方案来解决兼容性和开发体系问题。其中最有名的莫过于 [Babel](https://babeljs.io/) 了，Babel 是一个广泛使用的转码器，他的目标是使用 Babel 可以转换所有  ES6 新语法，从而在现有环境执行。

##### Use next generation JavaScript, today

Babel 不仅能够转换 ES6 代码，同时还是 ES7 的试验场。比如已经支持 async/await，使开发者更容易编写异步代码，代码逻辑和可读性简直不能太好了。虽然主流浏览器可能还需要一段时间才能支持这个异步编码方式，但是基于 Babel，开发者现在就可以在生产环境使用上它。这得益于 Babel 与 JavaScript 技术委员会保持高度一致，能够在 ECMAScript 新特性在标准化之前提供现实世界可用的实现。因此开发者能 **在生产环境大量使用未发布或未广泛支持的语言特性**，ECMAScript 也能够在规范最终定稿前获得现实世界的反馈，这种正向反馈又进一步推动了 JavaScript 语言向前发展。

Babel 最简单的使用方式如下：

```shell
# 安装 babel-cli 和 babel-preset-es2015 插件
npm install -g babel-cli
npm install --save babel-preset-es2015
```

在当前目录下建立文件.babelrc，写入：

```
{
  "presets": ['es2015']
}
```

更多的功能请参考[官网](https://babeljs.io)。

### ESLint

一个高质量的项目必须包含完善的 lint，如果一个项目中还是 tab、两个空格、四个空格各种混搭风，一个函数动不动上百行，各种 if、嵌套、回调好几层。加上前面提到的各种 JavaScript 糟粕和鸡肋，一股浓厚的城乡结合部风扑面而来，这还怎么写代码，每天调调代码格式得了。

这又怎么行呢，拿工资就得好好写代码，因此 lint 非常有必要，特别是对于大型项目，他可以保证代码符合一定的风格，有起码的可读性，团队里的其他人可以尽快掌握他人的代码。对于 JavaScript 项目而言，目前 ESLint 将是一个很好的选择。ESLint 的安装过程就不介绍了，请参考[官网](http://eslint.org/)，下面讲一个非常严格的 ESLint 的配置，这是对上面编写简洁的 JavaScript 代码一节最好的回应。

```js
{
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "plugin:react/recommended",
    "prettier",
    "prettier/react"
  ],
  "plugins": [
    "react",
    "prettier"
  ],
  "rules": {
  // prettier 配置用于自动化格式代码
    "prettier/prettier": [
      "error", 
      {
        "singleQuote": true,
        "semi": false,
        "trailingComma": "all",
        "bracketSpacing": true,
        "jsxBracketSameLine": true,
      }
    ],
    // 一个函数的复杂性不超过 10，所有分支、循环、回调加在一起，在一个函数里不超过 10 个
    "complexity": [2, 10],
    // 一个函数的嵌套不能超过 4 层，多个 for 循环，深层的 if-else，这些都是罪恶之源
    "max-depth": [2, 4],
    // 一个函数最多有 3 层 callback，使用 async/await
    "max-nested-callbacks": [2, 3],
    // 一个函数最多 5 个参数。参数太多的函数，意味着函数功能过于复杂，请拆分
    "max-params": [2, 5],
    // 一个函数最多有 50 行代码，如果超过了，请拆分之，或者精简之
    "max-statements": [2, 50],
    // 坚定的 semicolon-less 拥护者
    "semi": [2, "never"],
  },
  "env": {
    "browser": true,
  }
}
```

### Prettier

Prettier 一个 JavaScript 格式化工具. 它的灵感来源于 refmt，它对于 ES6、ES7、 JSX 和 Flow 的语言特性有着高级的支持。通过将 JavaScript 解析为 AST 并且基于 AST 美化和打印，Prettier 会丢掉几乎全部的原始的代码风格，从而保证 JavaScript 代码风格的一致性，你可以先感受一下。

![2017-08-29 23.32.57](/Users/inf/Downloads/2017-08-29 23.32.57.gif)

自动格式化代码，不管你原先的代码格式乱成什么样，他都会格式化成一样的，这个功能 **非常棒**，真的非常棒。以后我们再也不用关心代码格式的问题了。

ESLint 和 Prettier 确定了以后，一定要加到 pre commit hook 里面，因为人都是懒惰的，不要指望他们会主动去执行 ESLint 和 Prettier，所以新建了下面的 .pre-commit 文件，在 package.json 的scripts 的 postinstall 时 soft link 到 .git/hooks/pre-commit，这样在 pre commit 时会自动执行以下脚本。尽量在项目初始阶段就加入 pre commit hook，在项目中途加入可能会遇到团队的反对，执行起来较难。这也是面试的时候可以关注的一个地方，我们提高效率需要切实可行的手段，需要落到实处。

```shell
#!/bin/sh

# git diff --cached --name-only --diff-filter=ACM command returns all the file names those are part of that commit (except deleted files). And, then grep '.js$' filters only the JavaScript files.

CHANGED_ASSETS="$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep '.js$' | xargs)"

if [ -n "${CHANGED_ASSETS}" ]; then
    # Prettify all staged .js files
    echo "$jsfiles" | xargs ./node_modules/.bin/prettier --write

    # Add back the modified/prettified files to staging
    echo "$jsfiles" | xargs git add
    
    node_modules/.bin/eslint --fix ${CHANGED_ASSETS}
    exit $?
else
    exit 0
fi
```

如果想要在编辑时就格式化代码，Prettier 针对当前主流编辑器也有插件，请参考 [这里](https://github.com/prettier/prettier#editor-integration) ，另外 ESLint 可以和 Prettier 很好的搭配使用，参考 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) ，以上所有的配置和文件我都整理到了 [这个项目](https://github.com/ingf/elegant-writing-javascript) 里，为了让大伙能够好好写代码，真的是操碎了心。

### 函数式编程

balabala

### 保持一致性

和官方的设计理念、社区最佳实践保持一致。

#### React

React 把 UI 划分出合适粒度的组件层级，符合 [单一功能原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)，在理想状况下，一个组件应该只做一件事情。如果这个组件功能不断丰富，它应该被分成更小的组件。在较为简单的例子中，通常自顶向下更容易，而在较大的项目中，自底向上会更容易构建整个应用。

请记住，代码是用来读的，这比写更重要，编写模块化的，思路清晰的代码。当你开始构建大型组件库的时候，你会开始欣赏 React 的思路清晰化和模块性，并且随着代码的复用，你的代码量会开始减少。

#### Koa Middleware

This section covers middleware authoring best practices, such as middleware accepting options, named middleware for debugging, among others.

##### Middleware options

When creating public middleware it's useful to conform to the convention of wrapping the middleware in a function that accepts options, allowing users to extend functionality. Even if your middleware accepts *no* options, this is still a good idea to keep things uniform.

Here our contrived `logger` middleware accepts a `format` string for customization, and returns the middleware itself:

```javascript
function logger(format) {
  format = format || ':method ":url"';

  return async function (ctx, next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);
    console.log(str);
    await next();
  };
}

app.use(logger());
app.use(logger(':method :url'));
```

##### Named middleware

Naming middleware is optional, however it's useful for debugging purposes to assign a name.

```js
function logger(format) {
  return async function logger(ctx, next) {
    // code
  }
}
```



