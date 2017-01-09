import React, { Component } from 'react'
import { View, StyleSheet, Linking, TouchableHighlight } from 'react-native'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import frLocale from 'date-fns/locale/fr'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swipeout from 'react-native-swipeout'

import AppText from '../../../components/AppText'
import Card from '../../../components/card/Card'
import ProgressiveImage from '../../../components/ProgressiveImage'
import { colors } from '../../../style'
import { distanceFmt, generateMapLink, haversineDistance } from '../../../util.js'

export default class ItemRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      deleteButton: [
        {
          text: 'Supprimer',
          backgroundColor: 'lightcoral',
          color: 'white',
          underlayColor: 'dimgray',
          onPress: () => this.props.onDeleteItem(this.props.item.id)
        }
      ]
    }
  }

  render () {
    return (
      <Swipeout
        right={this.state.deleteButton}
        autoClose
        sensitivity={0.9}
        style={{backgroundColor: colors.background}}
      >
        <TouchableHighlight onPress={this.props.onPressAction}>
          <View style={{flex: 1}}>
            <Card>
              <View
                style={styles.row}
              >
                <ProgressiveImage
                  thumbnailSource={{ uri: this.props.item.imgPlaceholderUrl }}
                  imageSource={{ uri: this.props.item.imgUrl }}
                  style={styles.image}
                />
                <View
                  style={{flex: 2, marginLeft: 5}}
                >
                  <AppText
                    style={StyleSheet.flatten(styles.title)}
                  >
                    {this.props.item.title}
                  </AppText>
                  <AppText
                    style={StyleSheet.flatten(styles.category)}
                  >
                    {this.props.item.category}
                  </AppText>
                  <View
                    style={styles.content}
                  >
                    <AppText
                      style={StyleSheet.flatten(styles.streetName)}
                      onPress={() => Linking.openURL(generateMapLink(
                        this.props.userLat,
                        this.props.userLon,
                        this.props.item.address.lat,
                        this.props.item.address.lon
                      ))}
                    >{`${this.props.item.address.streetName}, ${this.props.item.address.cityName}`}
                    </AppText>

                    <AppText style={StyleSheet.flatten(styles.distance)}>
                      {distanceFmt(haversineDistance(
                        this.props.userLat,
                        this.props.userLon,
                        this.props.item.address.lat,
                        this.props.item.address.lon
                      ))}
                    </AppText>
                  </View>
                  <View
                    style={styles.content}
                  >
                    <AppText>
                      {distanceInWordsToNow(
                        this.props.item.publishDate,
                        {locale: frLocale, addSuffix: true}
                      )}
                    </AppText>
                    <View style={{flexDirection: 'row', marginRight: 5}}>
                      <Icon name='remove-red-eye' iconStyle={{marginTop: 10}} size={20} color={colors.secondary} />
                      <AppText> {this.props.item.nViews}</AppText>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </TouchableHighlight>
      </Swipeout>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  category: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'red'
  },
  image: {
    width: 100 - 10,
    height: 100 - 10,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5
  },
  title: {
    marginLeft: 10,
    marginTop: 10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 10
  },
  streetName: {
    color: colors.link
  },
  distance: {
    fontStyle: 'italic',
    color: colors.background,
    marginRight: 5
  }
})

ItemRow.propTypes = {
  item: React.PropTypes.object,
  onDeleteItem: React.PropTypes.func,
  onPressAction: React.PropTypes.func,
  userLat: React.PropTypes.number,
  userLon: React.PropTypes.number
}