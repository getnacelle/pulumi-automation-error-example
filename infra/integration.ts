import { LocalWorkspace } from '@pulumi/pulumi/x/automation';
import * as aws from '@pulumi/aws';

async function run() {
  const pulumiProgram = async () => {
    const bucket = new aws.s3.Bucket('myBucket');
    const lambda = new aws.lambda.CallbackFunction('myLambda', {
      callback: async () => ({ statusCode: 200 })
    });
    return { bucketArn: bucket.arn, lambdaName: lambda.name };
  };

  const stackArgs = {
    stackName: 'nacelle/pulumi-automation-error',
    projectName: 'automation-testing',
    program: pulumiProgram
  };

  const stack = await LocalWorkspace.createOrSelectStack(stackArgs);
  await stack.workspace.installPlugin('aws', 'v3.6.1');
  await stack.setConfig('aws:region', { value: 'us-east-2' });
  await stack.refresh({ onOutput: console.info });

  await stack.up({ onOutput: console.info });
  const outputs = await stack.outputs();
  console.log(outputs);
  return outputs;
}

run().catch(console.error);
