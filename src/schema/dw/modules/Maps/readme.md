### Spotlight uganda and global maps schema and resolvers

No major table changes required in DW for this module.

The data from DW per indicator is expected to match this interface

```
type MapUnit {
  # country code Id or distict code for case of spotlight uganda
  id: String
  year: Int
  value: Int
}
```