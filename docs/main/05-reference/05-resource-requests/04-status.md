# Status
As part of your pipeline you can optionally send information about the
resource request back to the resource requester by writing information to `/metadata/status.yaml`.
The file can contain arbitrary key values, with the `message` key being a special key that is communicated back
to the user when running `kubectl get <resource-request>`. For example if my pipeline wrote the
following to the `/metadata/status.yaml` file:
 ```yaml
 message: Resource request provisioned with database size 10Gb
 connectionDetails:
   host: example.com
   dbName: root
 ```

Kratix would pickup the status and apply it back to the resource request. The
user would see the following when getting the resource request:
```shell
kubectl get database
NAME                   STATUS
example                Resource request provisioned with database size 10Gb
```
And if they inspected the full status output `kubectl get database example -o yaml`:
```yaml
apiVersion: example.promise.syntasso.io/v1
kind: Database
...
status:
 message: Resource request provisioned with database size 10Gb
 connectionDetails:
   host: example.com
   dbName: root
```

They will see all the additional key values. Status provides a simple way to
communicate information back to the resource requester. Kratix will automatically
inject the required fields for status into the `xaasCRD`,you do not have to manually
add these fields.
