import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export const createLambda = () => {
  const lambda = new aws.lambda.CallbackFunction('mylambda', {
    callback: async () => 'hi'
  });

  return { lambdaName: lambda.name };
};
