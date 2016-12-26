import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, View } from 'react-native'

import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/MaterialIcons'

import AppText from '../components/AppText'
import Container from '../components/Container'
import { colors } from '../style'
import { getAccountSettings } from '../store/api'

export default class AccountScene extends Component {

  constructor (props) {
    super(props)
    this.state = {
      accountSettings: {}
    }
  }

  componentDidMount () {
    getAccountSettings()
      .then(accountSettings => { this.setState({accountSettings: JSON.parse(accountSettings)}) })
      .catch(() => { this.setState({accountSettings: {}}) })
  }

  updateAccountSettings (accountSettings) {
    this.setState({accountSettings})
    AsyncStorage.setItem('accountSettings', JSON.stringify(accountSettings))
  }

  render () {
    return (
      <View style={{flex: 1, marginBottom: 40}}>
        <AppText>{this.state.accountSettings.name}</AppText>
        <AppText>{this.state.accountSettings.surname}</AppText>
        <ActionButton
          buttonColor={colors.primary}
          icon={<Icon color='white' name='list' size={24} />}
        >
          <ActionButton.Item buttonColor={colors.accent} title='Modifier mon mot de passe' onPress={() => console.log('notes tapped!')}>
            <Icon name='lock-outline' style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={colors.accent} title='Modifier mon adresse e-mail' onPress={() => {}}>
            <Icon name='mail-outline' style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={colors.accent} title='Modifier mes informations' onPress={() => {}}>
            <Icon name='person-outline' style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 24,
    color: 'white'
  }
})

AccountScene.propTypes = {
  accountSettings: React.PropTypes.object,
  updateAccountSettings: React.PropTypes.func
}
