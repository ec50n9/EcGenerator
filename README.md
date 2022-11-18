# 松歌

一些用于描述后端 api 各个对象的语法，比如 DO、DTO、VO 等。基于 JSON 结构，通过一些简单的符号来描述完整的对象结构。

## 示例

目前只是用于打磨时间的小demo，基本功能尚未完成。但是理想中的效果大概是这样的：

### 输入：source.json

```json
[
    {
        "name": "User",
        "do": {
            "id": "long!",
            "username": "str!",
            "nickname": "str?$username",
            "password": "str!",
            "sex": "int:(0|1|2)?0",
            "age": "int:(0-100)?18",
            "description": "str?null",
            "createdBy": "~User.id",
            "createdAt": "date-time",
            "updatedBy": "~User.id",
            "updatedAt": "date-time",
            "isDeleted": "bool?false"
        }
    }
]
```

### 输出：JS Map

```js
EcTable {
  depsWaitingResolved: Map(2) { 'createdBy' => 'User.id', 'updatedBy' => 'User.id' },
  DOFieldsMap: Map(12) {
    'id' => EcField {
      name: 'id',
      type: 'long',
      defaultValue: null,
      canBeBlank: false,
      range: null
    },
    'username' => EcField {
      name: 'username',
      type: 'str',
      defaultValue: null,
      canBeBlank: false,
      range: null
    },
    'nickname' => EcField {
      name: 'nickname',
      type: 'str',
      defaultValue: '$username',
      canBeBlank: true,
      range: null
    },
    'password' => EcField {
      name: 'password',
      type: 'str',
      defaultValue: null,
      canBeBlank: false,
      range: null
    },
    'sex' => EcField {
      name: 'sex',
      type: 'int',
      defaultValue: '0',
      canBeBlank: true,
      range: '(0|1|2)'
    },
    'age' => EcField {
      name: 'age',
      type: 'int',
      defaultValue: '18',
      canBeBlank: true,
      range: '(0-100)'
    },
    'description' => EcField {
      name: 'description',
      type: 'str',
      defaultValue: 'null',
      canBeBlank: true,
      range: null
    },
    'createdBy' => EcField {
      name: 'id',
      type: 'long',
      defaultValue: null,
      canBeBlank: false,
      range: null
    },
    'createdAt' => EcField {
      name: 'createdAt',
      type: 'date-time',
      defaultValue: null,
      canBeBlank: true,
      range: null
    },
    'updatedBy' => EcField {
      name: 'id',
      type: 'long',
      defaultValue: null,
      canBeBlank: false,
      range: null
    },
    'updatedAt' => EcField {
      name: 'updatedAt',
      type: 'date-time',
      defaultValue: null,
      canBeBlank: true,
      range: null
    },
    'isDeleted' => EcField {
      name: 'isDeleted',
      type: 'bool',
      defaultValue: 'false',
      canBeBlank: true,
      range: null
    }
  }
}
```

输出的结果是一个 JS 的 Map 对象，后面可以根据这个 Map 对象，搭配模板引擎（比如 mustache），可以用于生成后端接口代码。

## 名字由来

为何叫作“松歌”？松衍变于我的名字，称其作歌则是因为这些语法本质上是在表达或描述某些结构，歌亦是如此，只不过表达的是情感。

还有一个更巧妙的联系：松 => song => 歌。

而编写“松歌”的过程，称之为吟唱。语法基于 JSON，学习成本极低。主要的描述符号只有寥寥几个，却足以描述一个较为完整的结构。在“松歌”转换成对象的过程中，会自动检测语法，如果有不恰当的地方会自动警告。这也是为何称之为吟唱：随心所欲，不逾矩。

> 诗言志，歌詠言，声依永，律和声。
> 
> 随心所欲，不逾矩。
