import React, { Component } from 'react'
import { ListView, StyleSheet, View, RefreshControl } from 'react-native'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import frLocale from 'date-fns/locale/fr'

import AppText from './AppText'
import EventRow from './EventRow'
import ProgressiveImage from './ProgressiveImage'
import { getEvents, getUser } from '../store/api'
import { colors } from '../style'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class UserView extends Component {

  constructor (props) {
    super(props)
    this.state = {
      events: [],
      items: {},
      refreshing: false
    }
  }

  componentWillMount () {
    getUser()
      .then(user => { this.setState({user}) })
      .catch(() => { this.setState({user: {}}) })

    getEvents()
      .then(events => { this.setState({events}) })
      .catch(() => { this.setState({events: []}) })
  }

  _onRefresh () {
    this.setState({refreshing: true})

    getEvents()
      .then(events => { this.setState({events}) })
      .catch(() => { this.setState({events: []}) })

    this.setState({refreshing: false})
  }

  render () {
    return (
      <View style={styles.wrapper}>
        {/* Header block which contains the user's information */}
        <View style={styles.top}>
          <View style={styles.header}>
            <View style={styles.headerImage}>
              <ProgressiveImage
                thumbnailSource={{ uri: this.props.user.imgPlaceholderUrl }}
                imageSource={{ uri: this.props.user.imgUrl }}
                style={styles.userImage}
              />
            </View>
            <View style={styles.headerDescription}>
              <AppText>{this.props.user.fullName}</AppText>
              <AppText style={{color: colors.background}}>
                {`Inscrit ${distanceInWordsToNow(
                  this.props.user.joinDate,
                  {locale: frLocale, addSuffix: true}
                )}`}
              </AppText>
            </View>
          </View>
        </View>
        {/* Timeline block which contains the user's activity log */}
        <View style={styles.bottom}>
          <ListView
            dataSource={ds.cloneWithRows(this.state.events)}
            enableEmptySections
            renderRow={event => <EventRow event={event} />}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            style={styles.timeline}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  top: {
    flex: 1
  },
  bottom: {
    flex: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerImage: {
    flex: 1
  },
  headerDescription: {
    alignItems: 'center',
    flex: 2,
    flexDirection: 'column',
    alignSelf: 'center'
  },
  timeline: {
    flex: 5
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.background
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  wrapper: {
    padding: 30,
    flex: 1
  }
})

UserView.propTypes = {
  user: React.PropTypes.object
}