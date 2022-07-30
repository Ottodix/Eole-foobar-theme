参考基线是 brix/crypto-js 3.1.9

使用jest单元测试

调查TypedArray使用情况

用class语法改写对象与继承

**模块**

为保持有多个输出和单个输出的引入方式一致，统一采用export



仅使用进入标准的特性

成员变量系列尚未进入标准，不是用



Base.create()，其实就是构造函数，但为了保持API不变，保留此函数

> constructor返回的是实例，但constructor属于实例而不是类；静态方法的this指的是类而不是实例，可通过new this返回实例；子类继承后，成员方法this指子实例，静态方法this指子类

采用静态方法的办法处理Base，保持API不变



Base.init() 也是构造函数的一部分，不再保留



mixIn还是需要的，省了Object.assign，仅在cipher中有使用，外部API中没有使用

测试中mixIn可以是类方法，但从实际使用中是实例方法，原来的架构中类和实例概念不清

好像可以实现中途给类添加方法，但这不是好的实践（其实mixIn也不是好的实践，反正动态类型）



clone:

1 保留类信息：通过具有相同的constructor表征

2 实例拷贝

思路：

使之具有相同的构造函数、原型对象

为了保证函数实现的代码与当前类名无关，尽量从实例获取类名（构造函数），使用inst.constructor

原先想用Object.create()，但这样不会执行构造方法

改用new this.constructor()再挂载枚举属性的办法



先照着实现，再考虑TypedArray



init就是构造函数，也不需要了



Hasher 中的 cfg，cfg是base的对象，传入的普通对象能混入

所以采用先建个base对象，再assign传入的cfg



_createHelper传入的应该是一个类



内部结构采用modules的结构

由于jest中使用cjm，所以测试环境下使用一个@babel/plugin-transform-modules-commonjs统一转换成cjm



关于wordarray

一个word指一个32位有符号整数，等价于8个16进制数（4bit)或4个byte（8bit）【一个字节2个16进制数】

sigBytes 指前多少个byte有效，默认全有效，即array长度*4

clamp指只保留有效的byte

concat前会先clamp



_createHelper返回的不是构造函数，是Hasher的快捷方式，可以使用箭头函数

Hasher 通过_createHelper，结果为一个函数，输入文本，返回一个Wordarray （源码中称为hash）

_createHelper本身传入一个hasher，新建此hasher实例，并调用其finalize，因此finalize函数为实例函数，返回计算出的Wordarray

C.Hasher 是函数，C.algo.Hasher是类

Cipher. _createHelper中注意，对象的方法不用箭头函数



注意Cipher的构造函数有参数，所以所有子元素都需要传入参数



mode

基类BlockCipherMode，类方法createEncryptor和createDecryptor，返回Encryptor和Decryptor的实例，还有一个构造函数，供Encryptor和Decryptor继承

mode类比如CBC本身是空的，有Encryptor和Decryptor两个成语变量，CBC本身供两个成员变量继承

Encryptor和Decryptor都只有一个方法processBlock,它供BlockCipher的\_doProcessBlock使用：this.\_mode.processBlock(words, offset)

Cipher 的createEncryptor和Mode的createEncryptor是没有关系的



import语句中的省略后缀名与默认入口文件并不是语言标准，有争议，浏览器未实现，因此暂不使用



Cipher类中reset是在构造函数中使用

###Cipher与Mode debug

已经进入了BlockCipher._doProcessBlock

问题可能出在reset中mode的构造上，首先不再有init了

en de 反了，注意类成员要用this.constructor.调用

去除BlockCipher.reset中是否有_mode的判断，一律新建



Cipher 的实例在构造函数中传入xformMode，决定此实例是encryptor还是decryptor，一般通过createEncryptor/createDecryptor创建实例



## 添加类型

添加类型声明，以不改变目前API层级且满足使用为目的，目前采用类的方式

所有的参数先都可选

所有构造函数附上 static create 的声明，构造函数写下面，注释给create



Mode即BlockCipherMode

algo 中除HMAC外都是Hasher