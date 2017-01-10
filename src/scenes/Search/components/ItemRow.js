import React, {Component} from 'react'

import { Dimensions, Linking, StyleSheet, TouchableHighlight, View } from 'react-native'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import frLocale from 'date-fns/locale/fr'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swipeout from 'react-native-swipeout'
import Toast from 'react-native-root-toast'
import { Actions } from 'react-native-router-flux'

import AppText from '../../../components/AppText'
import Card from '../../../components/card/Card'
import CardHeader from '../../../components/card/CardHeader'
import CardFooter from '../../../components/card/CardFooter'
import ProgressiveImage from '../../../components/ProgressiveImage'
import { distanceFmt, generateMapLink, haversineDistance } from '../../../util'
import { colors } from '../../../style'

const toast = text => Toast.show(text, {
  duration: Toast.durations.LONG,
  position: Toast.positions.BOTTOM,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 500,
  backgroundColor: colors.primary,
  shadowColor: colors.background,
  textColor: 'white'
})

export default class ItemRow extends Component {

  constructor (props) {
    super(props)
    this.likeButton = [
      {
        text: <Icon name='favorite-border' iconStyle={{marginTop: 10}} size={30} color='white' />,
        backgroundColor: 'orange',
        color: 'white',
        underlayColor: 'orange',
        onPress: () => this.onLeftSwipeoutPressed()
      }
    ]
  }

  onLeftSwipeoutPressed () {
    toast(<AppText style={StyleSheet.flatten(styles.toast)}>{`"${this.props.item.title}" a été ajouté à votre liste d'items`}</AppText>)
    this.props.onLikeItem(this.props.item.id)
  }

  render () {
    return (
      <Swipeout
        right={this.likeButton}
        autoClose
        sensitivity={0.9}
        style={{backgroundColor: colors.background}}
      >
        <TouchableHighlight onPress={this.props.onPressAction}>
          <View style={{flex: 1}}>
            <Card>

              <CardHeader
                title={this.props.item.title}
                category={this.props.item.category}
              />

              <ProgressiveImage
                thumbnailSource={{ uri: this.props.item.imgPlaceholderUrl }}
                imageSource={{ uri: this.props.item.imgUrl }}
                style={styles.image}
              />

              {/* Metadata footer */}
              <View style={{height: 80, flex: 1, flexDirection: 'row'}}>

                {/* User image */}
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableHighlight
                    onPress={() => Actions.searchUserScene({user: this.props.item.publisher})}
                    underlayColor={colors.transparent}
                  >
                    <View>
                      <ProgressiveImage
                        thumbnailSource={{ uri: this.props.item.publisher.imgPlaceholderUrl }}
                        imageSource={{ uri: this.props.item.publisher.imgUrl }}
                        style={{width: 40, height: 40, borderRadius: 20}}
                      />
                    </View>
                  </TouchableHighlight>
                </View>

                {/* Item essential information */}
                <View style={{flex: 4, justifyContent: 'center'}}>
                  {/* Item's publisher full name */}
                  <View style={{flexDirection: 'row'}}>
                    <AppText>{this.props.item.publisher.fullName}</AppText>
                    <AppText style={{color: colors.background}}> {this.props.item.readablePublishedSince}</AppText>
                  </View>
                  {/* Item's address */}
                  <AppText
                    onPress={() => Linking.openURL(this.props.item.address.generateMapLink(
                      this.props.userLat,
                      this.props.userLon
                    ))}
                    style={{color: colors.link}}
                  >
                    {this.props.item.address.readableAddress}
                  </AppText>
                </View>

                {/* Icons */}
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  {/* Number of likes */}
                  <View style={{flexDirection: 'row', marginRight: 5}}>
                    <Icon name='star' iconStyle={{marginTop: 10}} size={20} color='gold' />
                    <AppText> {this.props.item.nLikes}</AppText>
                  </View>
                  {/* Number of views */}
                  <View style={{flexDirection: 'row', marginRight: 5}}>
                    <Icon name='remove-red-eye' iconStyle={{marginTop: 10}} size={20} color={colors.secondary} />
                    <AppText> {this.props.item.nViews}</AppText>
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
  toast: {
    fontWeight: 'bold'
  },
  image: {
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height / 2 - 10,
    justifyContent: 'center',
    alignSelf: 'center'
  }
})

ItemRow.propTypes = {
  item: React.PropTypes.object,
  onPressAction: React.PropTypes.func,
  userLat: React.PropTypes.number,
  userLon: React.PropTypes.number,
  onLikeItem: React.PropTypes.func
}
