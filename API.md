# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### DailyCloudWatchLogsArchiver <a name="DailyCloudWatchLogsArchiver" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver"></a>

#### Initializers <a name="Initializers" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer"></a>

```typescript
import { DailyCloudWatchLogsArchiver } from '@gammarer/aws-daily-cloud-watch-logs-archiver'

new DailyCloudWatchLogsArchiver(scope: Construct, id: string, props: DailyCloudWatchLogsArchiverProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer.parameter.props">props</a></code> | <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiverProps">DailyCloudWatchLogsArchiverProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.Initializer.parameter.props"></a>

- *Type:* <a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiverProps">DailyCloudWatchLogsArchiverProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.isConstruct"></a>

```typescript
import { DailyCloudWatchLogsArchiver } from '@gammarer/aws-daily-cloud-watch-logs-archiver'

DailyCloudWatchLogsArchiver.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiver.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### DailyCloudWatchLogsArchiverProps <a name="DailyCloudWatchLogsArchiverProps" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiverProps"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiverProps.Initializer"></a>

```typescript
import { DailyCloudWatchLogsArchiverProps } from '@gammarer/aws-daily-cloud-watch-logs-archiver'

const dailyCloudWatchLogsArchiverProps: DailyCloudWatchLogsArchiverProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiverProps.property.schedules">schedules</a></code> | <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty">ScheduleProperty</a>[]</code> | *No description.* |

---

##### `schedules`<sup>Required</sup> <a name="schedules" id="@gammarer/aws-daily-cloud-watch-logs-archiver.DailyCloudWatchLogsArchiverProps.property.schedules"></a>

```typescript
public readonly schedules: ScheduleProperty[];
```

- *Type:* <a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty">ScheduleProperty</a>[]

---

### ScheduleProperty <a name="ScheduleProperty" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.Initializer"></a>

```typescript
import { ScheduleProperty } from '@gammarer/aws-daily-cloud-watch-logs-archiver'

const scheduleProperty: ScheduleProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.property.target">target</a></code> | <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty">ScheduleTargetProperty</a></code> | *No description.* |

---

##### `description`<sup>Required</sup> <a name="description" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `target`<sup>Required</sup> <a name="target" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleProperty.property.target"></a>

```typescript
public readonly target: ScheduleTargetProperty;
```

- *Type:* <a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty">ScheduleTargetProperty</a>

---

### ScheduleTargetProperty <a name="ScheduleTargetProperty" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty.Initializer"></a>

```typescript
import { ScheduleTargetProperty } from '@gammarer/aws-daily-cloud-watch-logs-archiver'

const scheduleTargetProperty: ScheduleTargetProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty.property.destinationPrefix">destinationPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty.property.logGroupName">logGroupName</a></code> | <code>string</code> | *No description.* |

---

##### `destinationPrefix`<sup>Required</sup> <a name="destinationPrefix" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty.property.destinationPrefix"></a>

```typescript
public readonly destinationPrefix: string;
```

- *Type:* string

---

##### `logGroupName`<sup>Required</sup> <a name="logGroupName" id="@gammarer/aws-daily-cloud-watch-logs-archiver.ScheduleTargetProperty.property.logGroupName"></a>

```typescript
public readonly logGroupName: string;
```

- *Type:* string

---



