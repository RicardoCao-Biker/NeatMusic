import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { } from '../utils/api';
import store from '../redux/store';
import { connect } from 'react-redux';
import { changeSong, controlPlay, songId, songName, singerName } from '../redux/actions'

class Collect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collect: [],
            Id: 0,
            songName: '',
            showAdd: true,
            singer: ''
        };
    }
    componentWillReceiveProps() {
        let Id = store.getState().songId;
        let songName = store.getState().songName;
        let singer = store.getState().singerName;
        this.setState({
            Id: Id,
            songName: songName,
            singer: singer
        })
    }
    componentDidMount() {
        AsyncStorage.getItem('collect', (error, result) => {
            if (!result) { return }
            this.setState({
                collect: [...this.state.collect, ...JSON.parse(result)]
            })
        })
    }
    add() {
        let newCollect = {};
        newCollect.Id = this.state.Id;
        newCollect.songName = this.state.songName;
        newCollect.singer = this.state.singer;
        this.setState({
            collect: [...this.state.collect, newCollect]
        }, async () => {
            await AsyncStorage.setItem('collect', JSON.stringify(this.state.collect))
        })
    }
    play(Id, Name, author) {
        store.dispatch(songId(Id));
        store.dispatch(songName(Name));
        store.dispatch(singerName(author));
    }
    render() {
        let collectList = this.state.collect.map((item, index) =>
            <TouchableOpacity style={styles.wrapper} onPress={() => { this.play(item.Id, item.songName, item.singer) }} key={item.songName + index}>
                <View style={styles.collectName}>
                    <Text style={styles.collectIndex}>{index + 1}</Text><Text style={styles.collectItem}>{item.songName}</Text>
                </View>
                <Image source={require('../images/music1.png')} style={styles.play} />

            </TouchableOpacity>
        )
        return (
            <View style={styles.commentwrap}>
                <ScrollView style={styles.collectList}>
                    {collectList}
                </ScrollView>
                {JSON.stringify(this.state.collect).indexOf(this.state.Id) !== -1 || this.state.Id == 0 ? null :
                    <View style={styles.askToAdd}>
                        <Text style={styles.askText}>将当前歌曲添加到收藏列表？</Text>
                        <View style={styles.twoBtn}>
                            <TouchableOpacity style={styles.askText} onPress={() => { this.add() }}>
                                <Text style={styles.askText}>YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.askText} onPress={() => { this.hideAdd() }}>
                                <Text style={styles.askText}>NO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        songList: store.songList,
        songOrder: store.songOrder,
        songId: store.songId,
        songName: store.songName,
        singerName: store.singerName
    };
};

const styles = StyleSheet.create({
    commentwrap: { width: Dimensions.get('window').width, height: 617, paddingTop: 20, paddingLeft: 20, paddingRight: 20 },
    askToAdd: { width: Dimensions.get('window').width, height: 50, position: 'absolute', bottom: 50, flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'black' },
    askText: { color: 'white', lineHeight: 40, marginLeft: 10 },
    twoBtn: { flexDirection: 'row', height: 50, width: 100 },
    collectList: { width: Dimensions.get('window').width, height: 500 },
    collectItem: { fontSize: 20, lineHeight: 45, width: 320, borderBottomColor: '#e3dada', borderBottomWidth: 1 },
    wrapper: { flexDirection: 'row', justifyContent: 'space-between' },
    collectName: { flexDirection: 'row' },
    collectIndex: { color: '#757575', lineHeight: 45, marginRight: 15 },
    play: { right: 60, width: 25, height: 25, marginTop: 10 },
})

export default connect(mapStateToProps)(Collect);
