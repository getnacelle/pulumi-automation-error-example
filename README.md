`pulumi up` at the root of the project works great 👌

```
13:25:48 blake pulumi-automation-error-example master ? pulumi preview
Previewing update (nacelle/pulumi-automation-error)

View Live: https://app.pulumi.com/nacelle/pulumi-automation-error-example/pulumi-automation-error/previews/f6147e2c-528d-40ee-b2be-aeecebfabeb7

     Type                             Name                                                     Plan
 +   pulumi:pulumi:Stack              pulumi-automation-error-example-pulumi-automation-error  create
 +   ├─ aws:iam:Role                  mylambda                                                 create
 +   ├─ aws:iam:Policy                mylambda-LambdaFullAccess                                create
 +   ├─ aws:lambda:Function           mylambda                                                 create
 +   └─ aws:iam:RolePolicyAttachment  mylambda-lambdaFullAccessCopyAttachment                  create
```

Building and then running the compiled output (as shown in many of the [examples here](https://github.com/pulumi/automation-api-examples/tree/main/nodejs)) fails with this error:

```
13:27:58 blake pulumi-automation-error-example master ? npm run integration                                                                                                                                                                           1 ↵

> pulumi-automation-error-example@ integration /Users/blake/dev/nacelle/pulumi-automation-error-example
> tsc && node ./bin/index.js


/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/pulumi/runtime/settings.js:121
        throw new Error("Program run without the Pulumi engine available; re-run using the `pulumi` CLI");
              ^
Error: Program run without the Pulumi engine available; re-run using the `pulumi` CLI
    at requireTestModeEnabled (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/pulumi/runtime/settings.js:121:15)
    at Object.getMonitor (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/pulumi/runtime/settings.js:205:13)
    at Object.registerResource (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/pulumi/runtime/resource.js:212:32)
    at new Resource (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/pulumi/resource.js:215:24)
    at new CustomResource (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/pulumi/resource.js:307:9)
    at new Role (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/iam/role.ts:190:9)
    at new CallbackFunction (/Users/blake/dev/nacelle/pulumi-automation-error-example/node_modules/@pulumi/lambda/lambdaMixins.ts:305:20)
    at Object.<anonymous> (/Users/blake/dev/nacelle/pulumi-automation-error-example/index.ts:3:16)
    at Module._compile (internal/modules/cjs/loader.js:1200:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1220:10)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! pulumi-automation-error-example@ integration: `tsc && node ./bin/index.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the pulumi-automation-error-example@ integration script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

Running the integration tests with no external dependencies in the `package.json` dependencies list:

```
13:37:13 blake pulumi-automation-error-example master ? npm run ts

> pulumi-automation-error-example@ ts /Users/blake/dev/nacelle/pulumi-automation-error-example
> ts-node ./infra/integration

Refreshing (nacelle/pulumi-automation-error)


View Live: https://app.pulumi.com/nacelle/automation-testing/pulumi-automation-error/updates/3




 ~  pulumi:pulumi:Stack automation-testing-pulumi-automation-error refreshing

    pulumi:pulumi:Stack automation-testing-pulumi-automation-error running

 ~  aws:iam:Policy myLambda-LambdaFullAccess refreshing

 ~  aws:iam:Role myLambda refreshing

 ~  aws:iam:RolePolicyAttachment myLambda-lambdaFullAccessCopyAttachment refreshing

 ~  aws:s3:Bucket myBucket refreshing

    aws:iam:RolePolicyAttachment myLambda-lambdaFullAccessCopyAttachment

    aws:iam:Role myLambda  [diff: +description,tags~assumeRolePolicy]

    aws:iam:Policy myLambda-LambdaFullAccess  [diff: +description]

    aws:s3:Bucket myBucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning]

    pulumi:pulumi:Stack automation-testing-pulumi-automation-error


Outputs:
    bucketArn: "arn:aws:s3:::mybucket-4fa2084"

Resources:
    5 unchanged

Duration: 5s


Updating (nacelle/pulumi-automation-error)


View Live: https://app.pulumi.com/nacelle/automation-testing/pulumi-automation-error/updates/4




    pulumi:pulumi:Stack automation-testing-pulumi-automation-error running

    aws:iam:Role myLambda  [diff: -description,tags~assumeRolePolicy]

    aws:s3:Bucket myBucket  [diff: -accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning]

    aws:iam:Policy myLambda-LambdaFullAccess  [diff: -description]

 +  aws:lambda:Function myLambda creating

    aws:iam:RolePolicyAttachment myLambda-lambdaFullAccessCopyAttachment

 +  aws:lambda:Function myLambda created

    pulumi:pulumi:Stack automation-testing-pulumi-automation-error


Outputs:

    bucketArn : "arn:aws:s3:::mybucket-4fa2084"
  + lambdaName: "myLambda-65501a0"

Resources:
    + 1 created
    5 unchanged

Duration: 8s


{
  bucketArn: { value: 'arn:aws:s3:::mybucket-4fa2084', secret: false },
  lambdaName: { value: 'myLambda-65501a0', secret: false }
}
```

Installing an external dependency (any) and then running the integration tests acts like the lambda should not exist. This happens regardless of if that dependency is imported in one of the source files. Below we install Lodash, but it is not used in _any_ of the source files. The lambda gets removed and is completely ignored until uninstalling Lodash.

```
13:39:32 blake pulumi-automation-error-example master ? npm i lodash -S
npm WARN pulumi-automation-error-example@ No repository field.
npm WARN pulumi-automation-error-example@ No license field.

+ lodash@4.17.20
added 1 package from 2 contributors and audited 121 packages in 1.037s

19 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

13:40:08 blake pulumi-automation-error-example master ? npm run ts

> pulumi-automation-error-example@ ts /Users/blake/dev/nacelle/pulumi-automation-error-example
> ts-node ./infra/integration

Refreshing (nacelle/pulumi-automation-error)


View Live: https://app.pulumi.com/nacelle/automation-testing/pulumi-automation-error/updates/7




 ~  pulumi:pulumi:Stack automation-testing-pulumi-automation-error refreshing

    pulumi:pulumi:Stack automation-testing-pulumi-automation-error running

 ~  aws:iam:Policy myLambda-LambdaFullAccess refreshing

 ~  aws:iam:RolePolicyAttachment myLambda-lambdaFullAccessCopyAttachment refreshing

 ~  aws:iam:Role myLambda refreshing

 ~  aws:s3:Bucket myBucket refreshing

 ~  aws:lambda:Function myLambda refreshing

    aws:iam:RolePolicyAttachment myLambda-lambdaFullAccessCopyAttachment

    aws:iam:Role myLambda  [diff: +description,tags~assumeRolePolicy]

    aws:iam:Policy myLambda-LambdaFullAccess  [diff: +description]

    aws:lambda:Function myLambda  [diff: +codeSigningConfigArn,description,imageUri,kmsKeyArn,layers,sourceCodeHash,tags,tracingConfig~code]

    aws:s3:Bucket myBucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning]

    pulumi:pulumi:Stack automation-testing-pulumi-automation-error


Outputs:
    bucketArn : "arn:aws:s3:::mybucket-4fa2084"
    lambdaName: "myLambda-65501a0"

Resources:
    6 unchanged

Duration: 5s


Updating (nacelle/pulumi-automation-error)


View Live: https://app.pulumi.com/nacelle/automation-testing/pulumi-automation-error/updates/8




    pulumi:pulumi:Stack automation-testing-pulumi-automation-error running

    aws:iam:Role myLambda  [diff: -description,tags~assumeRolePolicy]

    aws:s3:Bucket myBucket  [diff: -accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning]

    aws:iam:Policy myLambda-LambdaFullAccess  [diff: -description]

    aws:iam:RolePolicyAttachment myLambda-lambdaFullAccessCopyAttachment

 -  aws:lambda:Function myLambda deleting

 -  aws:lambda:Function myLambda deleted

    pulumi:pulumi:Stack automation-testing-pulumi-automation-error


Outputs:
    bucketArn : "arn:aws:s3:::mybucket-4fa2084"
  - lambdaName: "myLambda-65501a0"

Resources:
    - 1 deleted
    5 unchanged

Duration: 3s


{
  bucketArn: { value: 'arn:aws:s3:::mybucket-4fa2084', secret: false }
}
```
