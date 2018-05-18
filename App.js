import React from 'react';
import { StyleSheet, KeyboardAvoidingView} from 'react-native';
import { Header } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { ApiAiClient } from 'api-ai-javascript';
import { DIALOGFLOW_ACCESS_TOKEN } from 'react-native-dotenv';
import uuid from 'uuid';

const dialogflow = new ApiAiClient({
    accessToken: DIALOGFLOW_ACCESS_TOKEN
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


class App extends React.Component {

    constructor(){
        super();
        this.state = {
            messages: [],
            user: {
                _id: 2,
                name: 'Chatbot',
                avatar: 'https://cdn-images-1.medium.com/max/1200/1*0Cj-W6K2TP_xAh-rXxunBg.png',
            },
        }
    }

    onSend(messages = []) {
        this.appendToChat(messages);
        this.sendQuery(messages).done();
    }

    appendToChat(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    async sendQuery(messages = []) {
        const response = await dialogflow.textRequest(messages[0].text);
        this.appendToChat([{
            _id: uuid.v4(),
            text: response.result.fulfillment.speech === '' ? '¿Puedes repetirlo?' : response.result.fulfillment.speech,
            createdAt: new Date(),
            user: this.state.user,
        }]);
    }

    UNSAFE_componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hola que tal',
                    createdAt: new Date(),
                    user: this.state.user,
                },
            ],
        })
    }

  render() {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Header
                backgroundColor="#233978"
                centerComponent={{ text: 'GDGBot', style: { color: '#fff' } }}
            />

            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        </KeyboardAvoidingView>
    );
  }
}

export default App;