using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ham.Radio.Messages;
using Ham.Radio.Utils;

namespace Ham.Radio.Network
{
  public class InputDispatcher
  {
    public class GroupStateEventHandler
    {
      public delegate void MessageReceivedHandler(GroupStateMsg msg);
      public event MessageReceivedHandler OnEvent;

      public void Fire(GroupStateMsg msg)
      {
        if (OnEvent != null)
          OnEvent(msg);
      }
    }

    private Dictionary<Constants.Panel.SwitchId, GroupStateEventHandler> groupStateHandlers = new Dictionary<Constants.Panel.SwitchId, GroupStateEventHandler>();


    public void Initialize()
    {
      Singleton.Get<EventDispatcher>().Handler<GroupStateMsg>().OnEvent += GroupStateMessageHandler;
    }

    private void GroupStateMessageHandler(GroupStateMsg msg)
    {
      GroupStateEventHandler handler = null;
      if (!groupStateHandlers.TryGetValue((Constants.Panel.SwitchId)msg.id, out handler))
      {
        return;
      }

      handler.Fire(msg);
    }

    public GroupStateEventHandler GroupStateHandler(Constants.Panel.SwitchId id)
    {
      GroupStateEventHandler handler = null;
      if (!groupStateHandlers.TryGetValue(id, out handler))
      {
        handler = new GroupStateEventHandler();
        groupStateHandlers.Add(id, handler);
      }
      return handler;
    }
  }
}
