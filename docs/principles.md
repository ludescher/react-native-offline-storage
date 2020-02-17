### Entity
*	Should have access to its Repository.
    * So, I could easily update (pull/put) the Entity
    * Or if the Entity is Unloaded, I could just lazy load the Entity
* Log when the Entity was last used
    * So, you could remove the Entity by a Garbage Collector
        * But keep all references to this Entity, in case, I still need it, I just could lazy load it again
* If you access the Entity you could (async) call the server for a checkup (modified), if the entity is still up to date.
    * If not, return a SyncValue Entity as a placeholder

### Storage
* On rehydrate
   * set default value by type
      * array => empty array and entity => null
      * array => empty array and entity => new empty entity instance
* Add Prefix to Storage-Key
   * You should set the User-Id as the prefix, all User-specific data is now related to the user id and can only be accessed by the user with the right id (this resolved a few issues with, different user accessing all userdata => not optimal).
