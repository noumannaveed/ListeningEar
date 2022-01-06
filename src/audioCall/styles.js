import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen'
  },
  mainView: {
    flex: 1,
    height:'100%',
    width:'100%'
  },
  imageView: {
    height: 150,
    width: 150,
    backgroundColor: "red",
    borderRadius: 150 / 2,
    alignSelf: "center",
    marginTop: 20

  },
  title:{
    fontSize:20,
    alignSelf:"center",
    marginTop:10,
    color:"white"
  },
  channelInputContainer: {
    padding: 10,
  },
  joinLeaveButtonContainer: {
    padding: 10,
  },
  usersListContainer: {
    padding: 10,
  },
  floatRight: {
    // position: 'absolute',
    // right: 10,
    bottom: 40,
    width: 80,
  },
  floatLeft: {
    // position: 'absolute',
    // left: 10,
    bottom: 40,
    // width: 150,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
  },
});
