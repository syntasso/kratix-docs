#!/usr/bin/env ruby

require 'yaml'

# Read the input YAML file
input_yaml = YAML.load_file('/kratix/input/object.yaml')

# Extract values from input
app_name = input_yaml['metadata']['name']
namespace = input_yaml['metadata']['namespace']
app_image = input_yaml['spec']['image']

# Create the Runtime request
runtime_request = {
  'apiVersion' => 'marketplace.kratix.io/v1alpha1',
  'kind' => 'Runtime',
  'metadata' => {
    'name' => app_name,
    'namespace' => namespace
  },
  'spec' => {
    'image' => app_image,
    'replicas' => 1,
    'servicePort' => 80,
    'applicationEnv' => [
      { 'name' => 'PORT', 'value' => '80' }
    ]
  }
}

database_driver = input_yaml.dig('spec', 'database', 'driver')

if database_driver == "postgresql" then
  # The PostgreSQL Request
  database_request = {
    'apiVersion' => 'marketplace.kratix.io/v1alpha1',
    'kind' => 'postgresql',
    'metadata' => {
      'name' => app_name + '-db',
      'namespace' => namespace
    },
    'spec' => {
      'env' => 'dev',
      'teamId' => app_name,
      'dbName' => app_name + '-db'
    }
  }

  # This is the secret name the PostgreSQL promise will generate
  secret_name="#{app_name}.#{app_name}-#{app_name}-db-postgresql.credentials.postgresql.acid.zalan.do"

  ## Injecting the secrets into the application env
  runtime_request['spec']['applicationEnv'].push({
    'name' => 'PGHOST',
    'value' => '${app_name}-${app_name}-db-postgresql.default.svc.cluster.local'
  }, {
    'name' => 'DBNAME',
    'value' => '${app_name}-db'
  }, {
    'name' => 'PGUSER',
    'valueFrom' => {
      'secretKeyRef' => { 'name' => secret_name, 'key' => 'username' }
    }
  }, {
      'name' => 'PGPASSWORD',
      'valueFrom' => {
        'secretKeyRef' => { 'name' => secret_name, 'key' => 'password' }
      }
    }
  )

  File.write('/kratix/output/postgresql-request.yaml', database_request.to_yaml)
end

cache_driver = input_yaml.dig('spec', 'cache', 'driver')

if cache_driver == "redis" then
  redis_request = {
    'apiVersion' => 'marketplace.kratix.io/v1alpha1',
    'kind' => 'redis',
    'metadata' => {
      'name' => app_name + '-cache',
      'namespace' => namespace
    },
    'spec' => {
      'size' => 'small'
    }
  }

  runtime_request['spec']['applicationEnv'].push({
    'name' => 'REDIS_URL',
    'value' => "redis://rfs-#{app_name}-cache:26379/1"
  }, {
    'name' => 'REDIS_POOL_SIZE',
    'value' => '5'
  })

  File.write('/kratix/output/redis-request.yaml', redis_request.to_yaml)
end

# Write to Runtime request to the output file
File.write('/kratix/output/runtime-request.yaml', runtime_request.to_yaml)