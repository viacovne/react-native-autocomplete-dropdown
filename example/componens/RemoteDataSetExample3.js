import React, { memo, useCallback, useRef, useState } from "react"
import { Button, Dimensions, Platform, Text, View } from "react-native"
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown"

import Feather from "react-native-vector-icons/Feather"
Feather.loadFont()

export const RemoteDataSetExample3 = memo(() => {
  const [loading, setLoading] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const dropdownController = useRef(null)

  const searchRef = useRef(null)

  const getSuggestions = useCallback(async (q) => {
    console.log("getSuggestions", q)
    if (typeof q !== "string" || q.length < 3) {
      setSuggestionsList(null)
      return
    }
    setLoading(true)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts")
    const items = await response.json()
    const suggestions = items.map((item) => ({
      id: item.id,
      title: item.title
    }))
    setSuggestionsList(suggestions)
    setLoading(false)
  }, [])

  const onClearPress = useCallback(() => {
    setSuggestionsList(null)
  }, [])

  const onOpenSuggestionsList = useCallback((isOpened) => {}, [])

  return (
    <>
      <View
        style={[
          { flex: 1, flexDirection: "row", alignItems: "center" },
          Platform.select({ ios: { zIndex: 1 } })
        ]}
      >
        <Button
          style={{ flexGrow: 0 }}
          title="Clear"
          onPress={() => dropdownController.current.clear()}
        ></Button>
        <View style={{ width: 10 }}></View>
        <AutocompleteDropdown
          ref={searchRef}
          direction={Platform.select({ ios: "down" })}
          controller={(controller) => {
            dropdownController.current = controller
          }}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedItem(item.id)
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
          onClear={onClearPress}
          onSubmit={(e) => console.log(e.nativeEvent.text)}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false} // prevent rerender twice
          textInputProps={{
            placeholder: "Type 3+ letters",
            autoCorrect: false,
            autoCapitalize: "none",
            style: {
              borderRadius: 25,
              backgroundColor: "#fff",
              color: "#383b42",
              paddingLeft: 18,
              borderWidth: 1,
              borderColor: "#383b42"
            }
          }}
          rightButtonsContainerStyle={{
            borderRadius: 25,
            right: 8,
            height: 30,
            top: 6,
            alignSelfs: "center",
            backgroundColor: "#fff"
          }}
          inputContainerStyle={{
            backgroundColor: "transparent",
            shadowColor: "#00000099",
            shadowOffset: {
              width: 0,
              height: 5
            },
            shadowOpacity: 0.3,
            shadowRadius: 8.46,

            elevation: 13
          }}
          suggestionsListContainerStyle={{
            backgroundColor: "#fff"
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <Text style={{ color: "#383b42", padding: 15 }}>{item.title}</Text>
          )}
          ChevronIconComponent={
            <Feather name="x-circle" size={18} color="#383b42" />
          }
          ClearIconComponent={
            <Feather name="chevron-down" size={20} color="#383b42" />
          }
          //inputHeight={50}
          //   showChevron={false}
          showClear={false}
        />
      </View>
      <Text style={{ color: "#668", fontSize: 13, marginTop: 15 }}>
        Selected item id: {JSON.stringify(selectedItem)}
      </Text>
    </>
  )
})
