/** @jsx h */
import h from "../../shared/hyperscript";

export default (
  <value>
    <document>
      <paragraph>Edit the unorder list below:</paragraph>
      <unordered_list>
        <list_item>
          <list_item_child>Depth 1A</list_item_child>
          <unordered_list>
            <list_item>
              <list_item_child>Depth 2A</list_item_child>
              <unordered_list>
                <list_item>
                  <list_item_child>Depth 3A</list_item_child>
                </list_item>
                <list_item>
                  <list_item_child>Depth 3B</list_item_child>
                </list_item>
              </unordered_list>
            </list_item>
            <list_item>
              <list_item_child>Depth 2B</list_item_child>
            </list_item>
          </unordered_list>
        </list_item>
        <list_item>
          <list_item_child>Depth 1B</list_item_child>
        </list_item>
      </unordered_list>

      <paragraph>Edit the order list below:</paragraph>
      <ordered_list>
        <list_item>
          <list_item_child>Depth 1A</list_item_child>
          <ordered_list>
            <list_item>
              <list_item_child>Depth 2A</list_item_child>              
            </list_item>
            <list_item>
              <list_item_child>Depth 2B</list_item_child>
              <ordered_list>
                <list_item>
                  <list_item_child>Depth 3A</list_item_child>
                </list_item>
                <list_item>
                  <list_item_child>Depth 3B</list_item_child>
                </list_item>
              </ordered_list>
            </list_item>
          </ordered_list>
        </list_item>
        <list_item>
          <list_item_child>Depth 1B</list_item_child>
        </list_item>
      </ordered_list>
    </document>
  </value>
);
