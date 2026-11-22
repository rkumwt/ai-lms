import type { CourseSeed } from './types';

export const awsCourse: CourseSeed = {
  id: 'c-aws',
  title: 'AWS Solutions Architect Associate',
  description:
    'Prepare for the SAA exam: IAM, VPC networking, compute, storage and serverless patterns on AWS.',
  category: 'Cloud',
  tags: ['aws', 'cloud', 'certification', 'serverless'],
  level: 'intermediate',
  cover: ['#f59e0b', '#9a3412'],
  createdDaysAgo: 25,
  updatedDaysAgo: 1,
  targetInDays: 45,
  topics: [
    {
      title: 'IAM Users, Roles and Policies',
      tags: ['iam', 'security'],
      status: 'ready',
      durationSec: 520,
      confidence: 'okay',
      reviewInDays: 0,
      recordedDaysAgo: 10,
      points: [
        'Roles give temporary credentials; prefer them over long-lived user access keys.',
        'An explicit Deny always wins over any Allow during policy evaluation.',
        'Follow least privilege: start from no permissions and add only what is required.',
      ],
      qa: [
        ['What wins when a policy has both Allow and Deny for an action?', 'The explicit Deny'],
        ['Why prefer roles over access keys?', 'Roles issue short-lived, rotated credentials'],
        ['What is the principle of least privilege?', 'Grant only the permissions a task needs'],
      ],
    },
    {
      title: 'VPC Networking Basics',
      tags: ['vpc', 'networking'],
      status: 'failed',
      durationSec: 610,
      recordedDaysAgo: 3,
      points: [
        'A subnet is public when its route table sends 0.0.0.0/0 to an internet gateway.',
        'NAT gateways let private subnets reach the internet without accepting inbound traffic.',
        'Security groups are stateful; network ACLs are stateless and evaluated in rule order.',
      ],
      qa: [
        ['What makes a subnet public?', 'A route to an internet gateway'],
        ['Which is stateful: security groups or NACLs?', 'Security groups'],
        ['How do private instances download updates?', 'Through a NAT gateway'],
      ],
    },
    {
      title: 'S3 Storage Classes',
      tags: ['s3', 'storage'],
      status: 'ready',
      durationSec: 318,
      confidence: 'strong',
      reviewInDays: 9,
      recordedDaysAgo: 8,
      points: [
        'S3 Standard is for frequent access; Standard-IA is cheaper storage with a retrieval fee.',
        'Intelligent-Tiering moves objects between tiers automatically based on access.',
        'Glacier classes are for archives with retrieval times from minutes to hours.',
      ],
      qa: [
        ['Which class moves objects automatically between tiers?', 'S3 Intelligent-Tiering'],
        ['What is the trade-off of Standard-IA?', 'Lower storage cost but a per-GB retrieval fee'],
        ['Which classes suit long-term archives?', 'The Glacier storage classes'],
      ],
    },
    {
      title: 'Lambda and Serverless Patterns',
      tags: ['lambda', 'serverless'],
      status: 'draft',
      points: [
        'Lambda scales per request; cold starts add latency when new environments start.',
        'Use SQS between services to absorb bursts and retry failed events.',
        'Keep functions small and stateless; store state in DynamoDB or S3.',
      ],
      qa: [
        ['What causes a Lambda cold start?', 'A new execution environment being initialised'],
        ['Why put SQS in front of a Lambda?', 'To buffer bursts and retry failures'],
        ['Where should a Lambda keep state?', 'In an external store like DynamoDB or S3'],
      ],
    },
    {
      title: 'High Availability with Multi-AZ',
      tags: ['availability', 'rds'],
      status: 'draft',
      points: [
        'Spread instances across at least two Availability Zones behind a load balancer.',
        'RDS Multi-AZ keeps a synchronous standby for automatic failover.',
        'Read replicas scale reads but replicate asynchronously.',
      ],
      qa: [
        ['Is RDS Multi-AZ replication synchronous?', 'Yes, the standby is synchronous'],
        ['What are read replicas for?', 'Scaling read traffic'],
        ['How many AZs should a highly available app use?', 'At least two'],
      ],
    },
  ],
};
