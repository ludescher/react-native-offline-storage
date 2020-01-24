### Entity
*	Should have access to its Repository.
    * So, I could easily update (pull/put) the Entity
    * Or if the Entity is Unloaded, I could just lazy load the Entity
* Log when the Entity was last used
    * So, you could remove the Entity by a Garbage Collector
        * But keep all references to this Entity, in case, I still need it, I just could lazy load it again
* If you access the Entity you could (async) call the server for a checkup (modified), if the entity is still up to date.
    * If not, return a SyncValue Entity as a placeholder
