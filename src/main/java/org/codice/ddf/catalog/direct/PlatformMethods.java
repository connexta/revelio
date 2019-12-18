package org.codice.ddf.catalog.direct;

import static ddf.catalog.Constants.EXPERIMENTAL_FACET_RESULTS_KEY;
import static org.apache.commons.lang3.tuple.ImmutablePair.of;
import static org.codice.jsonrpc.JsonRpc.INTERNAL_ERROR;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableMap.Builder;
import ddf.action.Action;
import ddf.action.ActionRegistry;
import ddf.action.impl.ActionImpl;
import ddf.catalog.CatalogFramework;
import ddf.catalog.data.Attribute;
import ddf.catalog.data.AttributeDescriptor;
import ddf.catalog.data.AttributeRegistry;
import ddf.catalog.data.AttributeType.AttributeFormat;
import ddf.catalog.data.Metacard;
import ddf.catalog.data.MetacardType;
import ddf.catalog.data.Result;
import ddf.catalog.data.impl.AttributeDescriptorImpl;
import ddf.catalog.data.impl.AttributeImpl;
import ddf.catalog.data.impl.BasicTypes;
import ddf.catalog.data.impl.MetacardImpl;
import ddf.catalog.federation.FederationException;
import ddf.catalog.filter.FilterBuilder;
import ddf.catalog.filter.impl.PropertyNameImpl;
import ddf.catalog.operation.CreateResponse;
import ddf.catalog.operation.DeleteResponse;
import ddf.catalog.operation.FacetAttributeResult;
import ddf.catalog.operation.FacetValueCount;
import ddf.catalog.operation.QueryResponse;
import ddf.catalog.operation.Update;
import ddf.catalog.operation.UpdateResponse;
import ddf.catalog.operation.impl.CreateRequestImpl;
import ddf.catalog.operation.impl.DeleteRequestImpl;
import ddf.catalog.operation.impl.FacetedQueryRequest;
import ddf.catalog.operation.impl.QueryImpl;
import ddf.catalog.operation.impl.QueryRequestImpl;
import ddf.catalog.operation.impl.SourceInfoRequestSources;
import ddf.catalog.operation.impl.TermFacetPropertiesImpl;
import ddf.catalog.operation.impl.UpdateRequestImpl;
import ddf.catalog.source.IngestException;
import ddf.catalog.source.SourceUnavailableException;
import ddf.catalog.source.UnsupportedQueryException;
import java.io.Serializable;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.codice.jsonrpc.DocMethod;
import org.codice.jsonrpc.Error;
import org.codice.jsonrpc.JsonRpc;
import org.codice.jsonrpc.MethodSet;
import org.geotools.filter.SortByImpl;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.opengis.filter.Filter;
import org.opengis.filter.sort.SortBy;
import org.opengis.filter.sort.SortOrder;

/**
 * A class that represents the set of methods that are callable on the <code>CatalogFramework</code>
 * as a map where the key is the Json Rpc <code>method</code> string (eg, <code>ddf.catalog/create
 * </code>). the value of the map is a Method that can be called to dispatch the corresponding
 * action to the <code>CatalogFramework</code>
 */
public class PlatformMethods implements MethodSet {

  private static final String ISO_8601_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
  public static final String ATTRIBUTES = "attributes";

  //  private final transient SimpleDateFormat dateFormat = new
  // SimpleDateFormat(ISO_8601_DATE_FORMAT);

  private final Map<String, DocMethod> METHODS;

  {
    Builder<String, DocMethod> builder = ImmutableMap.builder();
    builder.put(
        "ddf.platform/metacard-actions",
        new DocMethod(
            this::metacardActions,
            ""));

    METHODS = builder.build();
  }

  @Override
  public Map<String, DocMethod> getMethods() {
    return METHODS;
  }

  private CatalogFramework catalogFramework;

  private List<MetacardType> metacardTypes;

  private AttributeRegistry attributeRegistry;

  private FilterBuilder filterBuilder;

  private ActionRegistry actionRegistry;

  public PlatformMethods(
      CatalogFramework catalogFramework,
      AttributeRegistry attributeRegistry,
      List<MetacardType> metacardTypes,
      FilterBuilder filterBuilder,
      ActionRegistry actionRegistry) {
    this.catalogFramework = catalogFramework;
    this.attributeRegistry = attributeRegistry;
    this.metacardTypes = metacardTypes;
    this.filterBuilder = filterBuilder;
    this.actionRegistry = actionRegistry;
  }

  /*
  params: {"metacardId": "<idhere>"}
   */
  private Object metacardActions(Map data) {
    Object metacardIdRaw = data.get("metacardId");
    if (!(metacardIdRaw instanceof String)){
      return new Error(JsonRpc.INVALID_PARAMS, "metacardId was not a string or not present");
    }
    String metacardId = (String) metacardIdRaw;



  }

  private List<Action> getMetacardActions(Metacard metacard) {
    return this.actionRegistry
        .list(metacard)
        .stream()
        .map(
            action ->
                new ActionImpl(
                    action.getId(), action.getTitle(), action.getDescription(), action.getUrl()))
        .collect(Collectors.toList());
  }


}
