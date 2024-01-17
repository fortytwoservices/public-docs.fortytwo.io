# Evolution HR

## Required HR configuration

In order for Fortytwo to connect to the HR system, we require a **Client ID** and **Client secret** configured under API access. Please provide this to your Fortytwo contact during the initial phase of implementation.

## Schema used for attribute mapping

The service sendes each employee as a standard SCIM representation to the Entra ID Inbound Provisioning API. The below is a full example of the payload we send, and can be used to define attribute mapping in the customer tenant:

```JSON
{
  "displayName": "Alma Nakken",
  "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
    "department": null,
    "manager": {
      "value": "2"
    },
    "employeeNumber": "1",
    "organization": "Company Inc",
    "division": "HR"
  },
  "urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User": {
    "enddate": null,
    "jobtitleid": 17,
    "orglevel0id": "197",
    "orglevel0name": "Company Inc",
    "orglevel1id": "187",
    "orglevel1name": "HR",
    "orglevel2id": null,
    "orglevel2name": null,
    "orglevel3id": null,
    "orglevel3name": null,
    "orglevel4id": null,
    "orglevel4name": null,
    "orglevelids": [
        "197",
        "187"
    ],
    "raw": null,
    "ssn": null,
    "startdate": null
  },
  "name": {
    "familyName": "Nakken",
    "givenName": "Alma"
  },
  "phoneNumbers": [
    {
      "type": "mobile",
      "value": "+4799999999"
    }
  ],
  "externalid": "1",
  "active": true,
  "schemas": [
    "urn:ietf:params:scim:schemas:core:2.0:User",
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
    "urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User"
  ],
  "title": "HR Consultant",
  "addresses": [
    {
      "primary": true,
      "type": "work",
      "region": "Oslo",
      "postalCode": "0862",
      "locality": "Oslo",
      "streetAddress": "Folke bernadottes vei 9A",
      "country": "NOR"
    }
  ]
}
```

| SCIM attribute                                                            | HR source object              | HR source attribute                                      |
|---------------------------------------------------------------------------|-------------------------------|----------------------------------------------------------|
| externalid                                                                | Employment                    | employeeid                                               |
| displayName                                                               | Employment                    | user.name                                                |
| title                                                                     | Employment                    | job.title                                                |
| name.familyName                                                           | UserProfile                   | surname                                                  |
| name.givenName                                                            | UserProfile                   | firstName                                                |
| phoneNumbers[type eq "mobile"].value                                      | UserProfile                   | workContactDetails.contactInfo.mobilePhone               |
| active                                                                    | Employment                    | firstWorkingDay, lastWorkingDay                          |
| addresses[type eq "work"].streetAddress                                   | UserProfile                   | workContactDetails.addressInfo.visitAddress.address      |
| addresses[type eq "work"].locality                                        | UserProfile                   | workContactDetails.addressInfo.visitAddress.city         |
| addresses[type eq "work"].region                                          | UserProfile                   | workContactDetails.addressInfo.visitAddress.municipality |
| addresses[type eq "work"].postalCode                                      | UserProfile                   | workContactDetails.addressInfo.visitAddress.zipCode      |
| addresses[type eq "work"].country                                         | UserProfile                   | workContactDetails.addressInfo.visitAddress.country      |
| urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber | Employment                    | employeeid                                               |
| urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager        | Employment                    | manager.employeeid                                       |
| urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization   | Employment, OrgStructure      | orgUnit.id used to get level 1 of org structure          |
| urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division       | Employment, OrgStructure      | orgUnit.id used to get level 2 of org structure          |
| urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department     | Employment, OrgStructure      | orgUnit.id used to get level 3 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User:startdate        | Employment                    | firstWorkingDay                                          |
| urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User:enddate          | Employment                    | lastWorkingDay                                           |
| urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User:ssn              | UserProfile                   | personalIdentification                                   |
| urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User:jobtitleid       | Employment                    | job.id                                                   |
| urn:ietf:params:scim:schemas:extension:fortytwo:1.0:User:startdate        | Employment                    | firstWorkingDay                                          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel0name    | Employment, OrgStructure      | orgUnit.id used to get level 1 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel1name    | Employment, OrgStructure      | orgUnit.id used to get level 2 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel2name    | Employment, OrgStructure      | orgUnit.id used to get level 3 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel3name    | Employment, OrgStructure      | orgUnit.id used to get level 4 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel4name    | Employment, OrgStructure      | orgUnit.id used to get level 5 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel0id      | Employment, OrgStructure      | orgUnit.id used to get level 1 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel1id      | Employment, OrgStructure      | orgUnit.id used to get level 2 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel2id      | Employment, OrgStructure      | orgUnit.id used to get level 3 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel3id      | Employment, OrgStructure      | orgUnit.id used to get level 4 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevel4id      | Employment, OrgStructure      | orgUnit.id used to get level 5 of org structure          |
| urn:ietf:params:scim:schemas:extension:fortytwo:2.0:User:orglevelids      | Employment, OrgStructure      | orgUnit.id used to get all ids from the org structure    |
