# Webex Add Collaborators Component

Webex add collaborators component search people on the basis of search query.

## Preview

To see the add collaborators component,
you can view our [storybook](https://webex.github.io/components/storybook/?path=/story/platform-webex-add-collaborators--search-people)

or run the following **NPM** command:

```shell
  npm start
```

## Embed

1. Create a component adapter from which the data will be retrieved (See [adapters](../../adapters)). For instance:

    ```js
    const jsonAdapter = new WebexJSONAdapter(jsonData);
    ```

2. Create a component instance and enclose it within [a data provider](../WebexDataProvider/WebexDataProvider.js)
that takes the [component data adapter](../../adapters/WebexJSONAdapter.js) that we created previously

  The following can be passed as props from the parent component to the add collaborators component:
  - `addedSpaceMembers` is a callback function to return the people added in the component

    ```js   
    <WebexDataProvider adapter={jsonAdapter}>
      <WebexAddCollaborators 
        addedSpaceMembers={addedSpaceMembersCb}
      />
    </WebexDataProvider>
    ```

The component knows how to manage its data. If anything changes in the data source that the adapter manages, the component will also update on its own.
